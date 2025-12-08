import { User } from "../models/user.model.js";
import { ApiError } from "./ApiError.js";

export async function generateToken(userId) {
    try {
        const user = await User.findById(userId);
        const token = user.generateJwtToken();

        user.jwtToken = token;
        await user.save({ validateBeforeSave: false });

        return { token };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went while generate token");
    }
}
