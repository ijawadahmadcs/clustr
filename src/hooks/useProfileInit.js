// src/hooks/useProfileInit.js
"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

export const useProfileInit = () => {
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const initializeUserProfile = async () => {
      if (!user.username || !user.uid) return;

      try {
        const userRef = doc(db, "users", user.username);
        const userDoc = await getDoc(userRef);

        // Only create profile if it doesn't exist
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            username: user.username,
            name: user.name,
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
      } catch (error) {
        console.error("Error initializing user profile:", error);
      }
    };

    initializeUserProfile();
  }, [user.username, user.uid, user.name, user.email]);
};

export default useProfileInit;
