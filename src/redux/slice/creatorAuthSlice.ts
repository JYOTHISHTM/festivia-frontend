
//creator auth slice

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    creator: any | null;
    token: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem("accessToken"),
    // isAuthenticated: !!localStorage.getItem("creatorToken"),
    creator: localStorage.getItem("creator")
        ? JSON.parse(localStorage.getItem("creator")!)
        : null,
    token: localStorage.getItem("accessToken") || null,
    // token: localStorage.getItem("creatorToken") || null,
};

const authSlice = createSlice({
    name: "creatorAuth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ creator: any; token: string }>) => {


            state.isAuthenticated = true;
            state.creator = action.payload.creator;
            state.token = action.payload.token;

            try {
                localStorage.setItem("accessToken", action.payload.token);
                // localStorage.setItem("creatorToken", action.payload.token);
                localStorage.setItem("creator", JSON.stringify(action.payload.creator));


            } catch (error) {
                console.warn("Storage might be full or disabled");
            }

            console.groupEnd();
        },
        logout: (state) => {
            console.group("🚪 Logout Action");
            state.isAuthenticated = false;
            state.creator = null;
            state.token = null;

            localStorage.removeItem("accessToken");
            // localStorage.removeItem("creatorToken");
            localStorage.removeItem("creator");

            console.groupEnd();
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;