"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase";

export default function Widgets() {
  const [suggestedUsers, setSuggestedUsers] = useState([]); // People to follow
  const [trendingTags, setTrendingTags] = useState([]); // Trending hashtags
  const currentUser = useSelector((state) => state.user); // Logged-in user

  // 🔹 Get suggested users
  useEffect(() => {
    if (!currentUser?.username) return; // stop if user not ready

    const q = query(collection(db, "users"), limit(5));
    const unsub = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs
        .map((doc) => doc.data())
        .filter((u) => u.username !== currentUser.username); // exclude yourself
      setSuggestedUsers(users);
    });

    return () => unsub(); // cleanup listener
  }, [currentUser?.username]);

  // 🔹 Get trending hashtags from posts
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => doc.data());
      const hashtagCount = {};

      // count hashtags
      posts.forEach((post) => {
        const tags = post.text?.match(/#\w+/g) || []; // find all hashtags
        tags.forEach((tag) => {
          hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
        });
      });

      // sort by frequency and take top 5
      const sortedTags = Object.entries(hashtagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      setTrendingTags(sortedTags);
    });

    return () => unsub();
  }, []);

  return (
    <div className="hidden lg:block w-80 p-4 space-y-4 bg-white">
      <div className="sticky top-0 z-10 pb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-full pl-10 pr-4 py-2 bg-white shadow-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2ad14e]"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-bold mb-2">Trending</h2>
        <ul className="space-y-2">
          {trendingTags.length > 0 ? (
            trendingTags.map(([tag, count]) => (
              <li key={tag} className="cursor-pointer text-[#2ad14e]">
                {tag} <span className="text-sm text-gray-50-500">{count}</span>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">No trending tags yet</p>
          )}
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-bold mb-2">Who to follow</h2>
        {suggestedUsers.length > 0 ? (
          suggestedUsers.map((user) => (
            <div
              key={user.uid}
              className="flex items-center justify-between mb-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <img
                  src={user.profilePicture || "/profile.avif"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </div>
              <button className="px-3 py-1 text-sm rounded-full bg-[#2ad14e] text-white hover:bg-green-600">
                Follow
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
}
