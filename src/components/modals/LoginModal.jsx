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
import { auth, googleProvider } from "@/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { signInUser } from "@/redux/slices/userSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.loginModalOpen);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      dispatch(
        signInUser({
          name: result.user.displayName,
          username: result.user.email.split("@")[0],
          email: result.user.email,
          uid: result.user.uid,
        })
      );
      dispatch(closeLoginModal());
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(
        signInUser({
          name: result.user.displayName,
          username: result.user.email.split("@")[0],
          email: result.user.email,
          uid: result.user.uid,
        })
      );
      dispatch(closeLoginModal());
    } catch (err) {
      console.error("Google Login Error:", err);
    }
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
        className="flex items-center justify-center"
        open={isOpen}
        onClose={() => {
          dispatch(closeLoginModal());
          setEmail("");
          setPassword("");
        }}
      >
        <div className="w-[90%] max-w-[500px] bg-white rounded-2xl shadow-lg relative p-6">
          <button
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
            onClick={() => {
              dispatch(closeLoginModal());
              setEmail("");
              setPassword("");
            }}
          >
            <X size={20} className="text-gray-500" />
          </button>

          <div className="w-full">
            <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>

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
              onClick={handleLogin}
              type="button"
              className="w-full py-3 rounded-lg text-white bg-green-500 hover:bg-green-600"
            >
              Login
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="px-2 text-gray-400 text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full py-3 rounded-lg border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-gray-700 font-medium">
                Sign in with Google
              </span>
            </button>

            <p className="text-center text-sm mt-4">
              Don't have an account?{" "}
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
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LoginModal;
