import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { options } from "../utils/constance.js";
import { sendWelcomeEmail } from "../utils/SendEmail.js";
import { Product } from "../models/product.model.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    if ([first_name, last_name, email, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User with email already exists.");
    }

    const user = await User.create({
        first_name,
        last_name,
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -jwtToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong on server.");
    }

    let name = `${first_name} ${last_name}`;

    // Ensure email sending doesn't block the response if it fails (optional safety)
    try {
        await sendWelcomeEmail(email, name);
    } catch (error) {
        console.error("Email sending failed:", error);
    }

    return res.status(200).json({
        message: "User registered successfully",
        userData: createdUser,
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password required.");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isValidPassword = await user.isPasswordCorrect(password);

    if (!isValidPassword) {
        throw new ApiError(401, "Invalid password");
    }

    const jwtToken = user.generateJwtToken();

    // Updating the token in DB is optional but okay if that's your logic
    user.jwtToken = jwtToken;
    await user.save({ validateBeforeSave: false });

    const loggedUser = await User.findById(user._id).select("-password -jwtToken");

    return res
        .status(200)
        .cookie("jwtToken", jwtToken, options) // Matches the middleware now
        .json({
            status: 200,
            message: "User login successfully",
            user: loggedUser,
            token: jwtToken,
        });
});

export const getAllProducts = asyncHandler(async (_, res) => {
    try {
        const products = await Product.find();

        if (!products) {
            return res.status(404).json({
                status_code: 404,
                message: "NOT_FOUND",
            });
        }

        return res.status(200).json({
            status_code: 200,
            products: products,
        });
    } catch (e) {
        return res.status(500).json({
            status_code: 500,
            error_message: e.message,
        });
    }
});