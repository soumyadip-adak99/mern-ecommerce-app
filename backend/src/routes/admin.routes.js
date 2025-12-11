import { Router } from "express";
import {
    addProduct,
    deleteProduct,
    deleteUserById,
    getAllOrders,
    getAllProducts,
    getUsers,
    updateProduct,
} from "../controllers/admin.controller.js";
import { findLoggedUserAdmin, verifyJwt } from "../middlewares/auth.middleware.js";
import upload from "../configuration/multer.js";

const router = Router();

router.route("/get-all-users").get(verifyJwt, findLoggedUserAdmin, getUsers);
router.route("/get-all-products").get(verifyJwt, findLoggedUserAdmin, getAllProducts);

router
    .route("/add-product")
    .post(verifyJwt, findLoggedUserAdmin, upload.single("image"), addProduct);

router.route("/delete/:id").delete(verifyJwt, findLoggedUserAdmin, deleteProduct);
router.route("/update-product/:id").put(verifyJwt, findLoggedUserAdmin, updateProduct);
router.route("/delete-user/:id").post(verifyJwt, findLoggedUserAdmin, deleteUserById);
router.route("/get-all-order").get(verifyJwt, findLoggedUserAdmin, getAllOrders);

export default router;
