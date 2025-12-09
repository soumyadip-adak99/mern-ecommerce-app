import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
            trim: true,
        },
        last_name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        profile_image: {
            type: String,
            default: "",
        },
        roles: {
            type: [String],
            default: ["USER"],
            enum: ["USER", "ADMIN"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },
        jwtToken: {
            type: String,
            default: "",
        },
        cart_items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        address: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Address",
            },
        ],
        buying_Products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        password_reset_otp: {
            type: String,
            default: null,
            select: false,
        },
    },
    {
        timestamps: true,
    },
);


userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJwtToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            first_name: this.first_name,
            last_name: this.last_name,
        },
        process.env.JWT_TOKEN,
        { expiresIn: process.env.TOKEN_EXPIRY },
    );
};


export const User = mongoose.model("User", userSchema);