import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import cloudinary from "../configuration/cloudinary.js";
import fs from "fs";
import { Orders } from "../models/orders.model.js";

export const getUsers = asyncHandler(async (_, res) => {
    try {
        const users = await User.find().select("-password -jwtToken");

        if (!users) {
            return res.status(404).json({
                status: "NOT_FOUND",
                message: "User does not exist",
            });
        }

        return res.status(200).json({
            message: "Users found",
            all_users: users,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Users not found",
            error: e.message,
        });
    }
});

export const getAllProducts = asyncHandler(async (_, res) => {
    try {
        const products = await Product.find();

        if (!products) {
            return res.status(404).json({
                status: "NOT_FOUND",
                message: "Products does not exist",
            });
        }

        return res.status(200).json({
            message: "Products found",
            all_Product: products,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Users not found",
            error: e.message,
        });
    }
});

export const addProduct = async (req, res) => {
    try {
        const { product_name, product_description, price, status, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "products",
        });

        
        fs.unlinkSync(req.file.path);

        const product = await Product.create({
            product_name,
            product_description,
            price,
            status,
            category,
            image: result.secure_url, 
        });

        return res.status(200).json({
            message: "Product added successfully",
            product,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: "BAD_REQUEST",
                message: "Please provide a valid id",
            });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                status: "NOT_FOUND",
                error_message: "Product not found",
            });
        }

        return res.status(200).json({
            status: "SUCCESS",
            message: "Product deleted",
            product: product,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: "INTERNAL_SERVER_ERROR",
            error_message: e.message,
        });
    }
});

export const updateProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: "BAD_REQUEST",
                error_message: "Please provide a valid product ID",
            });
        }

        const { product_name, product_description, price, image, status, category } = req.body;

        const existingProduct = await Product.findById(id);

        if (!existingProduct) {
            return res.status(404).json({
                status: "NOT_FOUND",
                error_message: "Product not found",
            });
        }

        existingProduct.product_name =
            product_name?.trim() !== "" ? product_name : existingProduct.product_name;

        existingProduct.product_description =
            product_description?.trim() !== ""
                ? product_description
                : existingProduct.product_description;

        existingProduct.price = price !== undefined && price !== "" ? price : existingProduct.price;

        existingProduct.image = image?.trim() !== "" ? image : existingProduct.image;

        existingProduct.status = status?.trim() !== "" ? status : existingProduct.status;

        existingProduct.category = category?.trim() !== "" ? category : existingProduct.category;

        const updatedProduct = await existingProduct.save();

        return res.status(200).json({
            status: "SUCCESS",
            message: "Product updated successfully",
            updated_product: updatedProduct,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: "INTERNAL_SERVER_ERROR",
            error_message: e.message,
        });
    }
});

export const deleteUserById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            console.log("Id not found");
            return res.status(400).json({
                status: "BAD_REQUEST",
                error_message: "Id not define",
            });
        }

        const user = await User.findById({ _id: id });
        if (!user) {
            console.error("User not found");
            return res.status(404).json({
                status: "NOT_FOUND",
                error_message: "User not found",
            });
        }

        const deleteUser = await User.findByIdAndDelete({ _id: user._id });

        if (!deleteUser) {
            console.log("Not delete user.");
            return res.status(500).json({
                status: "INTERNAL_SERVER_ERROR",
                error_message: "User not delete for some internal server error.",
            });
        }

        return res.status(200).json({
            status: "SUCCESS",
            message: "User delete Successfully",
            deleteUser: deleteUser,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: "INTERNAL_SERVER_ERROR",
            error_message: error.message,
        });
    }
});

export const getAllOrders = asyncHandler(async (_, res) => {
    try {
        const orders = await Orders.find();

        if (!orders) {
            console.log("No products found.");
            return res.status(404).json({
                status: "NOT_FOUND",
                error_message: "No orders found",
            });
        }

        return res.status(200).json({
            orders: orders,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "INTERNAL_SERVER_ERROR",
            status_code: error.message,
        });
    }
});
