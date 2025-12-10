import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API } from "../../utils/Constance"; // Adjust path if utils is located elsewhere

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async ({ id, orderData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("jwtToken");

            if (!token) {
                return rejectWithValue("Unauthorized: Token missing");
            }

            // Using the specific URL: /user/create-order/:id
            const response = await fetch(`${BASE_API}/user/create-order/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || "Order creation failed");
            }

            
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);
