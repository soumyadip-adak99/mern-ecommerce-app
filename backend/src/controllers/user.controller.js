import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getLoggedUser } from "../utils/loggedUser.js";

export const getUserDetails = asyncHandler(async (req, res) => {
    try {
        const userEmail = getLoggedUser(req);

        if (!userEmail) {
            return res.status(401).json(new ApiError(401, "User Unauthorized"));
        }

        const user = await User.findOne({ email: userEmail }).select("-jwtToken -password");

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
