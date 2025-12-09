import { Router } from "express";
import { addProduct, deleteProduct, getAllProducts, getUsers, updateProduct } from "../controllers/admin.controller.js";
import { findLoggedUserAdmin, verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/get-all-users").get(verifyJwt, findLoggedUserAdmin, getUsers);
router.route("/get-all-products").get(verifyJwt, findLoggedUserAdmin, getAllProducts);
router.route("/add-product").post(verifyJwt, findLoggedUserAdmin, addProduct);
router.route("/delete/:id").delete(verifyJwt, findLoggedUserAdmin, deleteProduct);
router.route("/update-product/:id").put(verifyJwt, findLoggedUserAdmin, updateProduct);

export default router;