"use client";
import React, { useState } from "react";
import { Modal } from "@mui/material";
import { X, Camera } from "lucide-react";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useSelector } from "react-redux";

const EditProfileModal = ({ isOpen, onClose, userProfile }) => {
  const currentUser = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: userProfile?.name || currentUser.name || "",
    bio: userProfile?.bio || "",
    location: userProfile?.location || "",
    website: userProfile?.website || "",
    profilePicture: userProfile?.profilePicture || "/profile.avif",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!currentUser.username) return;

    setLoading(true);
    try {
      const userRef = doc(db, "users", currentUser.username);

      // Create or update user document
      await setDoc(
        userRef,
        {
          username: currentUser.username,
          email: currentUser.email,
          uid: currentUser.uid,
          joinedDate: userProfile?.joinedDate || new Date(),
          followers: userProfile?.followers || [],
          following: userProfile?.following || [],
          ...formData,
        },
        { merge: true }
      );

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className="flex items-center justify-center"
    >
      <div className="w-[90%] max-w-[600px] bg-white rounded-2xl shadow-lg relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
              <h1 className="text-xl font-bold">Edit profile</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-1.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Cover Photo Section */}
          <div className="relative mb-16">
            <div className="h-48 bg-gradient-to-r from-[#2ad14e] to-[#47e669] rounded-lg relative">
              <button className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <Camera size={24} className="text-white" />
              </button>
            </div>

            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-4">
              <div className="relative">
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white bg-white"
                />
                <button className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition">
                  <Camera size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                maxLength={50}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ad14e] focus:border-transparent"
                placeholder="Your name"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {formData.name.length}/50
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                maxLength={160}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ad14e] focus:border-transparent resize-none"
                placeholder="Tell people about yourself"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {formData.bio.length}/160
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                maxLength={30}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ad14e] focus:border-transparent"
                placeholder="Where are you located?"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {formData.location.length}/30
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                maxLength={100}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ad14e] focus:border-transparent"
                placeholder="https://yourwebsite.com"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {formData.website.length}/100
              </div>
            </div>
          </div>

          {/* Birth Date Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Birth date
              </label>
              <button className="text-sm text-[#2ad14e] hover:underline">
                Edit
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Add your date of birth to personalize your experience
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
