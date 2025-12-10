import { Router } from "express";
import { findLoggedUser, verifyJwt } from "../middlewares/auth.middleware.js";
import {
    addAddress,
    addToCard,
    createOrder,
    deleteCartItem,
    getUserDetails,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/user-details").get(verifyJwt, findLoggedUser, getUserDetails);
router.route("/add-to-cart/:id").post(verifyJwt, findLoggedUser, addToCard);
router.route("/create-order/:id").post(verifyJwt, findLoggedUser, createOrder);
router.route("/add-address").post(verifyJwt, findLoggedUser, addAddress);
router.route("/delete-cart/:id").post(verifyJwt, findLoggedUser, deleteCartItem);

export default router;
