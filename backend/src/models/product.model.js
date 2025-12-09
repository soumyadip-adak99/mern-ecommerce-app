import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        product_name: {
            type: String,
            required: true,
            trim: true,
        },

        product_description: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 1,
        },

        image: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["IN_STOCK", "OUT_OF_STOCK", "COMING_SOON"],
            default: "IN_STOCK",
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
