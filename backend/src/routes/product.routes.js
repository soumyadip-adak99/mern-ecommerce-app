import { Router } from "express";
import { getProductById } from "../controllers/product.controller.js";

const router = Router();

router.route("/get-by-id/:id").get(getProductById);

export default router;
