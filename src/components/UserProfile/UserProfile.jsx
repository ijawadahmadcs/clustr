"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Calendar, MapPin, Link2, ArrowLeft } from "lucide-react";
import moment from "moment";
import EditProfileModal from "@/components/modals/EditProfileModal";
import FollowButton from "@/components/FollowButton/FollowButton";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useSelector } from "react-redux";

const UserProfilePage = () => {
  const params = useParams();
  const username = params?.username;
  const currentUser = useSelector((state) => state.user);

  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const name = useSelector((state) => state.user.name);
  const isOwnProfile = currentUser.username === username;

  useEffect(() => {
    if (!username) return;

    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", username));
        if (userDoc.exists()) setUserProfile(userDoc.data());
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = () => {
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const allPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserPosts(allPosts.filter((post) => post.username === username));
      });
      return unsubscribe;
    };

    fetchUserProfile();
    const unsubscribePosts = fetchUserPosts();

    return () => unsubscribePosts();
  }, [username]);

  if (loading) {
    return (
      <div className="flex-1 min-h-screen border-x border-gray-200 bg-white">
        <LoadingSpinner size="xl" className="h-64" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex-1 min-h-screen border-x border-gray-200 bg-white flex items-center justify-center">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const tabs = [
    { id: "posts", label: "Posts", count: userPosts.length },
    { id: "replies", label: "Replies", count: 0 },
    { id: "media", label: "Media", count: 0 },
    { id: "likes", label: "Likes", count: 0 },
  ];

  return (
    name && (
      <div className="flex-1 min-h-screen border-x border-gray-200 bg-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3 flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg">{userProfile.name}</h1>
            <p className="text-sm text-gray-500">{userPosts.length} posts</p>
          </div>
        </div>

        {/* Cover + Profile */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-[#2ad14e] to-[#47e669]" />
          <img
            src={userProfile.profilePicture || "/profile.avif"}
            alt={userProfile.name}
            className="absolute -bottom-16 left-4 w-32 h-32 rounded-full border-4 border-white bg-white"
          />
          {isOwnProfile && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute top-4 right-4 px-4 py-1.5 border border-gray-300 rounded-full bg-white hover:bg-gray-50"
            >
              Edit profile
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 mt-20 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{userProfile.name}</h2>
              <p className="text-gray-500">@{userProfile.username}</p>
            </div>
            {!isOwnProfile && <FollowButton targetUsername={username} />}
          </div>

          {userProfile.bio && (
            <p className="mt-3 text-gray-800">{userProfile.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
            {userProfile.location && (
              <span className="flex items-center gap-1">
                <MapPin size={16} /> {userProfile.location}
              </span>
            )}
            {userProfile.website && (
              <a
                href={userProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#2ad14e] hover:underline"
              >
                <Link2 size={16} /> {userProfile.website}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              Joined{" "}
              {moment(userProfile.joinedDate?.toDate()).format("MMMM YYYY")}
            </span>
          </div>

          {/* Follow Counts */}
          <div className="flex gap-4 mt-3 text-sm">
            <button className="hover:underline">
              <b>{userProfile.following?.length || 0}</b>{" "}
              <span className="text-gray-500">Following</span>
            </button>
            <button className="hover:underline">
              <b>{userProfile.followers?.length || 0}</b>{" "}
              <span className="text-gray-500">Followers</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? "text-[#2ad14e] border-b-2 border-[#2ad14e]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 text-xs">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Posts */}
        {activeTab === "posts" ? (
          userPosts.length === 0 ? (
            <p className="text-center py-12 text-gray-500">No posts yet</p>
          ) : (
            userPosts.map((post) => (
              <div
                key={post.id}
                className="flex gap-3 p-4 border-b border-gray-200 hover:bg-gray-50"
              >
                <img
                  src={userProfile.profilePicture || "/profile.avif"}
                  alt={post.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{post.name}</span>
                    <span className="text-gray-500">@{post.username}</span>
                    {post.timestamp && (
                      <span className="text-gray-400">
                        {moment(post.timestamp.toDate()).fromNow()}
                      </span>
                    )}
                  </div>
                  <p className="mt-1">{post.text}</p>
                  <div className="flex gap-4 text-gray-500 mt-3 text-sm">
                    <span>{post.comments?.length || 0} Comments</span>
                    <span>{post.likes?.length || 0} Likes</span>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          <p className="text-center py-12 text-gray-500">No {activeTab} yet</p>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            userProfile={userProfile}
          />
        )}
      </div>
    )
  );
};

export default UserProfilePage;
