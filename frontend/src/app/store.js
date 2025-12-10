import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/appFeatures/authSlice";
import productReducer from "../features/appFeatures/ProductSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
    },
});
