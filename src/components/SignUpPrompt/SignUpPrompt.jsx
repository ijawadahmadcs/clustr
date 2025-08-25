"use client";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function SignUpPrompt() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) return null; // hide if logged in

  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-2xl shadow-md text-center bg-white">
      <h2 className="text-lg font-bold mb-2">New to Clustr?</h2>
      <p className="text-sm text-gray-600 mb-4">
        Sign up now to follow topics, connect with people, and share your thoughts.
      </p>
      <div className="flex gap-2">
        <Link
          href="/signup"
          className="flex-1 bg-[#2ad14e] hover:bg-[#2ad14e]/90 text-white font-medium py-2 px-4 rounded-full transition"
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="flex-1 border border-[#2ad14e] text-[#2ad14e] hover:bg-green-50 font-medium py-2 px-4 rounded-full transition"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
