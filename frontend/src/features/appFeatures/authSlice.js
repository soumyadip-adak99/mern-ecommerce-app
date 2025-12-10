import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API } from "../../utils/Constance";

const PUBLIC_API_URL = `${BASE_API}/public`;
const AUTH_API_URL = `${BASE_API}/auth`;
const USER_API_URL = `${BASE_API}/user`;

// 1. Register User
// ======================
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${PUBLIC_API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Registration failed");

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { dispatch, rejectWithValue }) => {
        try {
            const response = await fetch(`${PUBLIC_API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Login failed");

            // Save token & user locally
            localStorage.setItem("jwtToken", data.token);

            const userDetails = await dispatch(getUserDetails());

            localStorage.setItem("user", JSON.stringify(userDetails.payload));
            localStorage.setItem("cart_item", JSON.stringify(userDetails.payload.cart_items));

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("Token not found");

        const response = await fetch(`${AUTH_API_URL}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            credentials: "include", // required to clear cookies
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Logout failed");

        // Clear local storage
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        localStorage.removeItem("cart_item");

        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const getUserDetails = createAsyncThunk(
    "auth/getUserDetails",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("jwtToken");

            if (!token) throw new Error("User unauthorized");

            const response = await fetch(`${USER_API_URL}/user-details`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Failed to fetch user");

            return data.userDetails;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("jwtToken") || null,
    isLoading: false,
    isError: false,
    errorMessage: "",
    isSuccess: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("user");
        },

        resetStatus: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.errorMessage = "";
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })

            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(getUserDetails.rejected, (state, action) => {
                state.isError = true;
                state.errorMessage = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
                state.user = action.payload.user;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isSuccess = true;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isError = true;
                state.errorMessage = action.payload;
            });
    },
});

export const { logout, resetStatus } = authSlice.actions;

export default authSlice.reducer;
