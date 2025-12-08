import { asyncHandler } from "../utils/asyncHandler.js";

export const healthCheck = asyncHandler((_, res) => {
    return res.status(200).json({
        message: "OK",
    });
});
