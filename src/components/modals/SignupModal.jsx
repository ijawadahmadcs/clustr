"use client";
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeSignupModal,
  openLoginModal,
  openSignupModal,
} from "@/redux/slices/modalSlice";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebase";
import { signInUser } from "@/redux/slices/userSlice";

const SignupModal = () => {
  const isOpen = useSelector((state) => state.modal.signupModalOpen);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup() {
    setError("");
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredentials.user, { displayName: name });

      dispatch(
        signInUser({
          name: userCredentials.user.displayName,
          username: userCredentials.user.email.split("@")[0],
          email: userCredentials.user.email,
          uid: userCredentials.user.uid,
        })
      );

      // Reset form and close modal
      setName("");
      setEmail("");
      setPassword("");
      dispatch(closeSignupModal());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(
          signInUser({
            name: currentUser.displayName,
            username: currentUser.email.split("@")[0],
            email: currentUser.email,
            uid: currentUser.uid,
          })
        );
      }
    });

    return unsubscribe;
  }, [dispatch]);

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
        className="flex items-center justify-center"
      >
        <div className="w-[90%] max-w-[500px] bg-white rounded-2xl shadow-lg relative p-6">
          <button
            onClick={() => dispatch(closeSignupModal())}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>

          <div className="w-full">
            <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

            {error && <p className="text-red-500 text-center mb-3">{error}</p>}

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
              onClick={handleSignup}
              type="button"
              className="w-full py-3 rounded-lg text-white bg-green-500 hover:bg-green-600"
            >
              Sign Up
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
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SignupModal;
