import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJwt = asyncHandler(async (req, _, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token =
            req.cookies?.accessToken ||
            (authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1]);

        if (!token) {
            throw new ApiError(401, "Unauthorized: Token not found");
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);

        if (!decoded || !decoded._id) {
            throw new ApiError(401, "Invalid or malformed token");
        }

        const user = await User.findById(decoded._id).select("-password -jwtToken");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("JWT Error: ", error.message);
        throw new ApiError(401, error.message || "Invalid Token");
    }
});

export const findLoggedUser = asyncHandler(async (req, _, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token =
            req.cookies?.accessToken || (authHeader && authHeader.replace("Bearer ", "").trim());

        if (!token) {
            throw new ApiError(401, "Unauthorized: no token provided.");
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findById(decoded._id).select("-password -jwtToken");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token.");
    }
});
