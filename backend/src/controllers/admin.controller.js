import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";

export const getUsers = asyncHandler(async (req, res) => {
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

export const getAllProducts = asyncHandler(async (req, res) => {
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

export const addProduct = asyncHandler(async (req, res) => {
    try {
        const { product_name, product_description, price, image, status, category } = req.body;

        if (
            [product_name, product_description, price, image, category].some(
                (field) => !field || field.trim() === ""
            )
        ) {
            return res.status(400).json({
                status: "BAD_REQUEST",
                message: "All fields are required",
            });
        }

        const product = await Product.create({
            product_name,
            product_description,
            price,
            image,
            status,
            category,
        });

        if (!product) {
            return res.status(500).json({
                status: "INTERNAL_SERVER_ERROR",
                error_message: "Error rise while adding product",
            });
        }

        return res.status(200).json({
            message: "Product added",
            product: product,
        });
    } catch (e) {
        return res.status(500).json({
            status: "INTERNAL_SERVER_ERROR",
            message: e.message,
        });
    }
});

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
