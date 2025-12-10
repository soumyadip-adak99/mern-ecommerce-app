import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/appFeatures/authSlice";
import productReducer from "../features/appFeatures/ProductSlice";
import orderReducer from "../features/appFeatures/orderSlice";
import cartReducer from "../features/appFeatures/cartSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        order: orderReducer,
        cart: cartReducer,
    },
});
