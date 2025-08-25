// redux/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import modalReducer from "@/redux/slices/modalSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer, // key is now `modal` for consistency
  },
});

export default store;
