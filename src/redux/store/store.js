import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice.js";
import modalReducer from "@/redux/slices/modalSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
  },
});

export default store;
