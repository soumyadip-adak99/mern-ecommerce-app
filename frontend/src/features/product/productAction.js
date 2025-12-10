import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_API = import.meta.env.VITE_BACKEND_BASE_API;
const PRODUCT_API_URL = `${BASE_API}/product`;

export const getProductById = createAsyncThunk(
    "product/getProductById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${PRODUCT_API_URL}/get-by-id/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch product");
            }

            return data.product;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
