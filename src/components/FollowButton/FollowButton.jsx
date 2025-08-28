// src/components/FollowButton/FollowButton.jsx
"use client";
import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useSelector, useDispatch } from "react-redux";
import { openLoginModal } from "@/redux/slices/modalSlice";

const FollowButton = ({ targetUsername }) => {
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [targetUserData, setTargetUserData] = useState(null);

  // Check if current user is following the target user
  useEffect(() => {
    if (!currentUser.username || !targetUsername) return;

    const unsubscribe = onSnapshot(
      doc(db, "users", currentUser.username),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setIsFollowing(userData.following?.includes(targetUsername) || false);
        }
      }
    );

    return () => unsubscribe();
  }, [currentUser.username, targetUsername]);

  // Get target user data for follower count
  useEffect(() => {
    if (!targetUsername) return;

    const unsubscribe = onSnapshot(doc(db, "users", targetUsername), (doc) => {
      if (doc.exists()) {
        setTargetUserData(doc.data());
      }
    });

    return () => unsubscribe();
  }, [targetUsername]);

  const handleFollow = async () => {
    if (!currentUser.username) {
      dispatch(openLoginModal());
      return;
    }

    if (currentUser.username === targetUsername) return; // Can't follow yourself

    setLoading(true);

    try {
      const currentUserRef = doc(db, "users", currentUser.username);
      const targetUserRef = doc(db, "users", targetUsername);

      if (isFollowing) {
        // Unfollow
        await updateDoc(currentUserRef, {
          following: arrayRemove(targetUsername),
        });
        await updateDoc(targetUserRef, {
          followers: arrayRemove(currentUser.username),
        });
      } else {
        // Follow
        await updateDoc(currentUserRef, {
          following: arrayUnion(targetUsername),
        });
        await updateDoc(targetUserRef, {
          followers: arrayUnion(currentUser.username),
        });
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show follow button for own profile
  if (currentUser.username === targetUsername) {
    return null;
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-6 py-1.5 rounded-full font-medium transition disabled:opacity-50 ${
        isFollowing
          ? "border border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
          : "bg-[#2ad14e] text-white hover:bg-[#26b342]"
      }`}
    >
      {loading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
