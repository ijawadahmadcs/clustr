"use client";
import React from "react";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "@/redux/slices/userSlice";
const UserProfile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSignout = async () => {
    await signOut(auth);
    dispatch(signOutUser());
  };
  return (
    <div
      onClick={handleSignout}
      className="mt-4 px-2 sm:px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs sm:text-sm cursor-pointer hover:bg-gray-200 flex justify-center sm:justify-start"
    >
      <Image
        src={"/clustr_logo.jpeg"}
        width={36}
        height={36}
        alt="Profile"
        className="w-9 h-9"
      />
      <div className="hidden sm:flex flex-col">
        <span className="hidden sm:inline font-bold ml-2">{user.name}</span>
        <span className="hidden sm:inline ml-2">{user.email}</span>
      </div>
    </div>
  );
};

export default UserProfile;
