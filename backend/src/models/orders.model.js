import { mongoose } from "mongoose";

const ordersSchema = mongoose.Schema(
    {
        payment_status: {
            type: String,
            required: true,
        },

        payment_mode: {
            type: String,
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    },
    { timestamps: true }
);

export const Orders = mongoose.model("Orders", ordersSchema);
