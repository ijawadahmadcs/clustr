// src/components/modals/SignupModal.jsx
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
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "@/firebase";
import { signInUser } from "@/redux/slices/userSlice";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const SignupModal = () => {
  const isOpen = useSelector((state) => state.modal.signupModalOpen);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔹 Create Firestore profile if not already existing
  const createUserProfile = async (user, displayName = "") => {
    try {
      const username = user.email.split("@")[0];
      const userRef = doc(db, "users", username);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          username,
          name: displayName || user.displayName || username,
          email: user.email,
          uid: user.uid,
          bio: "",
          location: "",
          website: "",
          profilePicture: "/profile.avif",
          coverPhoto: "",
          followers: [],
          following: [],
          joinedDate: serverTimestamp(),
          verified: false,
          postsCount: 0,
          likesCount: 0,
        });
      }
    } catch (err) {
      console.error("Firestore Error:", err);
      setError("Failed to create user profile.");
    }
  };

  const handleSignup = async () => {
    setError("");
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredentials.user, { displayName: name });

      await createUserProfile(userCredentials.user, name);

      dispatch(
        signInUser({
          name,
          username: userCredentials.user.email.split("@")[0],
          email: userCredentials.user.email,
          uid: userCredentials.user.uid,
        })
      );

      handleClose();
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Failed to sign up. Please try again.");
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await createUserProfile(user);

      dispatch(
        signInUser({
          name: user.displayName,
          username: user.email.split("@")[0],
          email: user.email,
          uid: user.uid,
        })
      );

      handleClose();
    } catch (err) {
      console.error("Google Signup Error:", err);
      setError("Google signup failed.");
    }
  };

  const handleClose = () => {
    dispatch(closeSignupModal());
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(
          signInUser({
            name: currentUser.displayName,
            username: currentUser.email?.split("@")[0],
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
        onClose={handleClose}
        className="flex items-center justify-center"
      >
        <div className="w-[90%] max-w-[500px] bg-white rounded-2xl shadow-lg relative p-6">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>

          <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

          {error && <p className="text-red-500 text-center mb-3">{error}</p>}

          <input
            type="text"
            placeholder="Name"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSignup}
            type="button"
            className="w-full py-3 rounded-lg text-white bg-green-500 hover:bg-green-600"
          >
            Sign Up
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-400 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full py-3 rounded-lg border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">
              Sign Up with Google
            </span>
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                handleClose();
                dispatch(openLoginModal());
              }}
              className="text-green-600 font-medium hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default SignupModal;
