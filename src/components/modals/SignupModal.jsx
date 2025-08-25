"use client";
import React from "react";
import { Modal } from "@mui/material";
import SignupPage from "@/app/(auth)/signup/page";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openSignupModal, closeSignupModal } from "@/redux/slices/modalSlice";

const SignupModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.signupModalOpen);

  return (
    <div>
      <button
        onClick={() => dispatch(openSignupModal())}
        className="w-32 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition"
      >
        Sign Up
      </button>

      <Modal
        open={isOpen}
        onClose={() => dispatch(closeSignupModal())}
        className="flex justify-center items-center"
      >
        <div className="w-[500px] h-[500px] bg-white rounded-2xl shadow-lg relative flex justify-center items-center mx-auto p-6">
          <button
            onClick={() => dispatch(closeSignupModal())}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>

          <SignupPage />
        </div>
      </Modal>
    </div>
  );
};

export default SignupModal;
