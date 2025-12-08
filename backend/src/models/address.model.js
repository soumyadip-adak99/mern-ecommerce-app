import mongoose from "mongoose";

const addressSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },

        name: {
            type: String,
            require: true,
            trim: true,
        },

        phone_number: {
            type: String,
            require: true,
            match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"],
        },

        country: {
            type: String,
            default: "India",
        },

        pin_code: {
            type: String,
            required: true,
            match: [/^\d{6}$/, "Invalid Indian PIN code"],
        },

        house_no: {
            type: String,
            require: true,
            trim: true,
        },

        area: {
            type: String,
            required: true,
            trim: true,
        },

        landmark: {
            type: String,
            default: "",
            trim: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        state: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Address = mongoose.model("Address", addressSchema);
