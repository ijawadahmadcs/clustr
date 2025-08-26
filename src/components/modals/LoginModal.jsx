"use client";
import { useState } from "react";
import { Modal } from "@mui/material";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeLoginModal,
  openSignupModal,
  openLoginModal,
} from "@/redux/slices/modalSlice";
import { login } from "@/redux/slices/authSlice.js";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.loginModalOpen);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user in Redux
      dispatch(login({ email: user.email, uid: user.uid }));

      // Reset and close
      setEmail("");
      setPassword("");
      dispatch(closeLoginModal());
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

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
        onClose={() => {
          dispatch(closeLoginModal());
          setError("");
          setEmail("");
          setPassword("");
        }}
        className="flex items-center justify-center"
      >
        <div className="w-[90%] max-w-[500px] bg-white rounded-2xl shadow-lg relative p-6">
          <button
            onClick={() => {
              dispatch(closeLoginModal());
              setError("");
              setEmail("");
              setPassword("");
            }}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>

          <form onSubmit={handleLogin} className="w-full">
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
              className={`w-full py-3 rounded-lg text-white ${
                loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              } transition`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
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
