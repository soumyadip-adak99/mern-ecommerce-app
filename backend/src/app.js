import express from "express";
import cookieParser from "cookie-parser";

// routes
import healthCheckRoute from "./routes/healthCheck.routes.js";
import publicRoute from "./routes/public.routes.js";
import authRoute from "./routes/auth.routes.js";

const app = express();

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

export { app };
