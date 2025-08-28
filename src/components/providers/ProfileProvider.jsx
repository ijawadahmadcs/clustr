// src/components/providers/ProfileProvider.js
"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import { signInUser, signOutUser } from "@/redux/slices/userSlice";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const ProfileProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // Function to create user profile if it doesn't exist
  const ensureUserProfile = async (currentUser) => {
    if (!currentUser) return;

    const username = currentUser.email.split("@")[0];
    const userRef = doc(db, "users", username);
    const userDoc = await getDoc(userRef);

    // Only create if profile doesn't exist
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        username: username,
        name: currentUser.displayName || username,
        email: currentUser.email,
        uid: currentUser.uid,
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
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Ensure user profile exists in Firestore
        await ensureUserProfile(currentUser);

        // User is signed in
        dispatch(
          signInUser({
            name: currentUser.displayName || currentUser.email.split("@")[0],
            username: currentUser.email?.split("@")[0] || "",
            email: currentUser.email || "",
            uid: currentUser.uid,
          })
        );
      } else {
        // User is signed out
        dispatch(signOutUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

export default ProfileProvider;
