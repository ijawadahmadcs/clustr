import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice.js";
import modalReducer from "@/redux/slices/modalSlice.js";
import userSlice from "@/redux/slices/userSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    user: userSlice,
  },
});

export default store;
