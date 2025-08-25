"use client";

import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { closeLoginModal, openSignupModal } from "@/redux/slices/modalSlice";
import { useState } from "react";

export default function LoginPage() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fake auth (replace with Firebase later)
    dispatch(login({ email: formData.email }));
    dispatch(closeLoginModal()); // Close modal on success
  };

  return (
    <div className="flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
        >
          Log In
        </button>
        <p className="text-center text-sm mt-4">
          New here?{" "}
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
  );
}
