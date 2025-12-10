import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// routes
import healthCheckRoute from "./routes/healthCheck.routes.js";
import publicRoute from "./routes/public.routes.js";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import adminRoute from "./routes/admin.routes.js";
import productRoute from "./routes/product.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

export const BASE_API = "/api/v1";

// health-check controllers
app.use(`${BASE_API}/health-check`, healthCheckRoute);

// public controller
app.use(`${BASE_API}/public`, publicRoute);

// user controller
// app.use(`${BASE_API}/user`, userRoute);

// auth controllers
app.use(`${BASE_API}/auth`, authRoute);

// user routes
app.use(`${BASE_API}/user`, userRoute);

// admin routes
app.use(`${BASE_API}/admin`, adminRoute);

// product routes
app.use(`${BASE_API}/product`, productRoute);

export { app };
