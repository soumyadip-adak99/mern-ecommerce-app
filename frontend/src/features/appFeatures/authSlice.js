import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API } from "../../utils/Constance";

const PUBLIC_API_URL = `${BASE_API}/public`;
const AUTH_API_URL = `${BASE_API}/auth`;
const USER_API_URL = `${BASE_API}/user`;

// 1. Register User
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

// 2. Login User
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

            // 1. Save Token Locally
            localStorage.setItem("jwtToken", data.token);

            // 2. Fetch User Details immediately after login
            const userDetails = await dispatch(getUserDetails());

            // 3. Save User Details & Cart Locally
            if (userDetails.payload) {
                localStorage.setItem("user", JSON.stringify(userDetails.payload));
                localStorage.setItem("cart_item", JSON.stringify(userDetails.payload.cart_items));
            }

            return { token: data.token, user: userDetails.payload };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 3. Logout User
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("jwtToken");

        if (token) {
            await fetch(`${AUTH_API_URL}/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        // Clear Local Storage
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        localStorage.removeItem("cart_item");

        return { success: true };
    } catch (error) {
        // Even if API fails, clear local storage
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        localStorage.removeItem("cart_item");
        return rejectWithValue(error.message);
    }
});

// 4. Get User Details
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
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Failed to fetch user");

            return data.userDetails;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 5. Add Address
export const addAddress = createAsyncThunk(
    "address/addAddress",
    async (addressData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("jwtToken");

            if (!token) {
                return rejectWithValue("User not authenticated");
            }

            const response = await fetch(`${USER_API_URL}/add-address`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(addressData),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.error_message || "Failed to add address");
            }

            return data.address; // returns created address object
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
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
            state.isSuccess = false;
            state.isError = false;
            state.errorMessage = "";
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("user");
            localStorage.removeItem("cart_item");
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
            // Register
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

            // Login
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
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })

            // Get User Details
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(getUserDetails.rejected, (state, action) => {
                state.isError = true;
                state.errorMessage = action.payload;
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isSuccess = true;
                state.isError = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.user = null;
                state.token = null;
                state.isError = true;
                state.errorMessage = action.payload;
            })

            // --- FIXED SECTION: ADD ADDRESS ---
            .addCase(addAddress.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                // 1. Safety Check: If user is somehow null, initialize it
                if (!state.user) {
                    state.user = {};
                }

                // 2. Safety Check: If 'address' array is missing/undefined, initialize it
                if (!Array.isArray(state.user.address)) {
                    state.user.address = [];
                }

                // 3. Push to state.user.address (NOT state.addressList)
                state.user.address.push(action.payload);

                // 4. Persist to localStorage to save changes on refresh
                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            });
    },
});

export const { logout, resetStatus } = authSlice.actions;

export default authSlice.reducer;
