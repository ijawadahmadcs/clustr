"use client";
import { Modal } from "@mui/material";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeSignupModal,
  openLoginModal,
  openSignupModal,
} from "@/redux/slices/modalSlice";
import { useState } from "react";
import { auth } from "@/firebase"; // Make sure Firebase is initialized
import { createUserWithEmailAndPassword } from "firebase/auth";
import { login } from "@/redux/slices/authSlice";

const SignupModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.signupModalOpen);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Dispatch login to Redux
      dispatch(login({ name, email: user.email, uid: user.uid }));

      // Close signup modal
      dispatch(closeSignupModal());

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
      console.error("Signup failed:", err);
    }
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => dispatch(openSignupModal())}
        className="w-32 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition"
      >
        Sign Up
      </button>

      <Modal
        open={isOpen}
        onClose={() => dispatch(closeSignupModal())}
        className="flex items-center justify-center"
      >
        <div className="w-[90%] max-w-[500px] bg-white rounded-2xl shadow-lg relative p-6 flex justify-center items-center">
          {/* Close Button */}
          <button
            onClick={() => dispatch(closeSignupModal())}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>

          <form onSubmit={handleSubmit} className="w-full">
            <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
            )}

            <input
              type="text"
              placeholder="Name"
              className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
            >
              Create Account
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  dispatch(closeSignupModal());
                  dispatch(openLoginModal());
                }}
                className="text-green-600 font-medium hover:underline"
              >
                Log In
              </button>
            </p>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SignupModal;
