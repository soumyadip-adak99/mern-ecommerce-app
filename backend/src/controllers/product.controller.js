import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProductById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById({ _id: id });

        if (!product) {
            return res.status(404).json({
                status: "NOT_FOUND",
                error_message: "Product not found",
            });
        }

        return res.status(200).json({
            product: product,
        });
    } catch (error) {
        return res.status(500).json({
            status: "INTERNAL_SERVER_ERROR",
            error_message: error.message,
        });
    }
});
