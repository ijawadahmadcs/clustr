"use client";
import { Modal } from "@mui/material";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { closeLoginModal, openSignupModal } from "@/redux/slices/modalSlice";
import { login } from "@/redux/slices/authSlice";
import { useState } from "react";
import { auth } from "@/firebase"; // firebase config
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.loginModalOpen);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Update Redux state
      dispatch(login({ email: user.email, uid: user.uid }));

      // Close modal
      dispatch(closeLoginModal());

      // Reset form
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
      console.error("Login failed:", err);
    }
  };

  return (
    <div>
      {/* Correct trigger button */}
      <button
        onClick={() => dispatch({ type: "modal/openLoginModal" })} // Open login modal
        className="w-32 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition"
      >
        Log In
      </button>

      <Modal
        open={isOpen}
        onClose={() => dispatch(closeLoginModal())}
        className="flex items-center justify-center"
      >
        <div className="w-[90%] max-w-[500px] bg-white rounded-2xl shadow-lg relative flex justify-center items-center p-6">
          <button
            onClick={() => dispatch(closeLoginModal())}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>

          <form onSubmit={handleSubmit} className="bg-white w-full">
            <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>

            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
            )}

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
              Log In
            </button>

            <p className="text-center text-sm mt-4">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  dispatch(closeLoginModal());
                  dispatch(openSignupModal());
                }}
                className="text-green-600 font-medium hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default LoginModal;
