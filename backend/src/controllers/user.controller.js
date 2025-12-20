import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getLoggedUser } from "../utils/loggedUser.js";
import { Product } from "../models/product.model.js";
import { Address } from "../models/address.model.js";
import { Orders } from "../models/orders.model.js";

export const getUserDetails = asyncHandler(async (req, res) => {
    try {
        const userEmail = getLoggedUser(req);

        if (!userEmail) {
            return res.status(401).json(new ApiError(401, "User Unauthorized"));
        }

        const user = await User.findOne({ email: userEmail })
            .select("-jwtToken -password")
            .populate("cart_items")
            .populate("address")
            .populate("buying_products")
            .populate("orders");

        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found"));
        }

        return res.status(200).json({
            status: 200,
            userDetails: user,
            message: "user details get successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "something went wrong on server",
            error_message: error.message,
        });
    }
});

export const addToCart = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const userEmail = getLoggedUser(req);
        const exitsUser = await User.findOne({ email: userEmail }).select("-password -jwtToken");

        const product = await Product.findOne({ _id: id });

        if (!product) {
            return res.status(404).json({
                status_code: 404,
                error_message: "Product not found",
            });
        }

        // check it the product already exits
        const alreadyExistsProduct = exitsUser.cart_items.includes(product._id);
        if (alreadyExistsProduct) {
            return res.status(400).json({
                status_code: 400,
                error_message: "Product already exists.",
            });
        }

        exitsUser.cart_items.push(product._id);

        //save
        await exitsUser.save();

        return res.status(200).json({
            status_code: 200,
            message: "Successfully add to cart",
            cart_items: exitsUser.cart_items,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: 500,
            error_message: e.message,
        });
    }
});

export const addAddress = asyncHandler(async (req, res) => {
    try {
        console.log("enter");
        let {
            name,
            phone_number,
            country,
            pin_code,
            house_no,
            area,
            landmark = "",
            city,
            state,
        } = req.body;

        const userEmail = getLoggedUser(req);
        const existsUser = await User.findOne({ email: userEmail }).select("-password -jwtToken");

        if (!name || name.trim() === "") name = `${existsUser.first_name}  ${existsUser.last_name}`;

        if (
            [name, phone_number, pin_code, house_no, area, city, state].some(
                (filed) => !filed || filed.trim() === ""
            )
        ) {
            return res.status(400).json({
                status_code: 400,
                error_message: "All filed are required.",
            });
        }

        const address = await Address.create({
            user: existsUser._id,
            name: name,
            phone_number: phone_number,
            country: country || "India",
            pin_code: pin_code,
            house_no: house_no,
            area: area,
            landmark: landmark,
            city: city,
            state: state,
        });

        existsUser.address.push(address._id);

        await existsUser.save();

        return res.status(200).json({
            status_code: 200,
            address: address,
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({
            status: 500,
            error_message: e.message,
        });
    }
});

export const createOrder = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        let { payment_status, payment_mode, address } = req.body;
        const userEmail = getLoggedUser(req);

        if (payment_mode === "COD") {
            payment_status = "PENDING";
        }

        const existsUser = await User.findOne({ email: userEmail }).select("-password -jwtToken");
        if (!existsUser) {
            return res.status(404).json({
                status: 404,
                error_message: "User not found",
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                status: 404,
                error_message: "Product not found",
            });
        }

        const existsAddress = await Address.findById({ _id: address });
        if (!existsAddress) {
            return res.status(404).json({
                status: 404,
                error_message: "Address not found",
            });
        }

        const newOrder = await Orders.create({
            payment_mode,
            payment_status,
            userId: existsUser._id,
            address: existsAddress._id,
            product: product._id,
        });

        existsUser.orders.push(product._id);
        await existsUser.save();

        console.log("done");
        return res.status(201).json({
            status_code: 201,
            message: "Order placed successfully!",
            order: newOrder,
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            error_message: e.message,
        });
    }
});

export const deleteCartItem = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const product = Product.findByIdAndDelete({ _id: id });

        if (!product) {
            return res.status(404).json({
                status: "NOT_FOUND",
                error_message: "product not found",
            });
        }

        return res.status(200).json({
            status: "SUCCESS",
            message: "product delete successfully",
            product: product,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: "INTERNAL_SERVER_ERROR",
            error_message: e.message,
        });
    }
});
