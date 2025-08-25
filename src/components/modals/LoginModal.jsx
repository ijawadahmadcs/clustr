"use client";
import React from "react";
import { Modal } from "@mui/material";
import LoginPage from "@/app/(auth)/login/page";
import { X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { openLoginModal, closeLoginModal } from "@/redux/slices/modalSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.loginModalOpen);

  return (
    <div>
      <button
        onClick={() => dispatch(openLoginModal())}
        className="w-32 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition"
      >
        Log In
      </button>

      <Modal
        open={isOpen}
        onClose={() => dispatch(closeLoginModal())}
        className="flex justify-center items-center"
      >
        <div className="w-[500px] h-[500px] bg-white rounded-2xl shadow-lg relative flex justify-center items-center mx-auto p-6">
          <button
            onClick={() => dispatch(closeLoginModal())}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>

          <LoginPage />
        </div>
      </Modal>
    </div>
  );
};

export default LoginModal;
