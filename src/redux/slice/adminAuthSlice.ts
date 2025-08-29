//admin auth slice

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    admin: any | null;
    token: string | null;
}

const initialState: AuthState = {
    // isAuthenticated: !!localStorage.getItem("adminToken"),
    isAuthenticated: !!localStorage.getItem("accessToken"),
    admin: (() => {
        try {
            const adminData = localStorage.getItem("admin");
            return adminData ? JSON.parse(adminData) : null;
        } catch (error) {
            console.error(" JSON Parse Error for Admin:", error);
            return null;
        }
    })(),
    token: localStorage.getItem("accessToken") || null,
    // token: localStorage.getItem("adminToken") || null,
};

const authSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ admin: any; token: string }>) => {
            console.group("🔐 Login Reducer");
            

            state.isAuthenticated = true;
            state.admin = action.payload.admin;
            state.token = action.payload.token;

            try {
                localStorage.setItem("accessToken", action.payload.token);
                // localStorage.setItem("adminToken", action.payload.token);
                localStorage.setItem("admin", JSON.stringify(action.payload.admin));

          
            } catch (error) {
                console.error("❌ localStorage Error:", error);
                console.warn("Storage might be full or disabled");
            }

            console.groupEnd();
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.admin = null;
            state.token = null;

            localStorage.removeItem("accessToken");
            // localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");

            console.groupEnd();
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
