import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { options } from "../utils/constance.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    if ([first_name, last_name, email, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const exitedUser = await User.findOne({ email });

    if (exitedUser) {
        throw new ApiError(409, "User with email already exits.");
    }

    const user = await User.create({
        first_name,
        last_name,
        email,
        password,
    });

    const createUser = await User.findById(user._id).select("-password -jwtToken");

    if (!createUser) {
        throw new ApiError(500, "Something went wrong on server.");
    }

    return res.status(200).json({
        message: "User register successfully",
        userData: createUser,
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

    // Save token in DB (optional)
    user.jwtToken = jwtToken;
    await user.save({ validateBeforeSave: false });

    const loggedUser = await User.findById(user._id).select("-password -jwtToken");

    return res.status(200).cookie("jwt", jwtToken, options).json({
        status: 200,
        message: "User login successfully",
        user: loggedUser,
        token: jwtToken,
    });
});
