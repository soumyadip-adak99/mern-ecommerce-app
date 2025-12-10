import { Router } from "express";
import { loginUser, registerUser, getAllProducts } from "../controllers/public.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/get-all-products").get(getAllProducts);

export default router;
