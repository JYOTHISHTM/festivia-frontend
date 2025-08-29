



import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import creatorAuthReducer from "./slice/creatorAuthSlice";
import adminAuthReducer from "./slice/adminAuthSlice";
import userReducer from "./slice/userSlice"
import creatorReducer from "./slice/creatorSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    creatorAuth:creatorAuthReducer,
    adminAuth:adminAuthReducer,
    user: userReducer,
    creator: creatorReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
