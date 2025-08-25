"use client";
import React, { useState } from "react";
import { Image, BarChart2, Smile, MapPin, MessageCircle, Heart, BarChart3, Share } from "lucide-react";

const PostFeed = () => {
  const [posts, setPosts] = useState([
    { id: 1, user: "Guest", handle: "@guest000234", time: "1d", text: "Hello World!" },
    { id: 2, user: "Guest", handle: "@guest000234", time: "2d", text: "Social Media App 🚀" },
    { id: 1, user: "Guest", handle: "@guest000234", time: "1d", text: "Hello World!" },
    { id: 2, user: "Guest", handle: "@guest000234", time: "2d", text: "Social Media App 🚀" },
    { id: 1, user: "Guest", handle: "@guest000234", time: "1d", text: "Hello World!" },
    { id: 2, user: "Guest", handle: "@guest000234", time: "2d", text: "Social Media App 🚀" },
  ]);
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      user: "Guest",
      handle: "@guest000234",
      time: "now",
      text: newPost,
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  return (
    <div className="flex-1 min-h-screen border-x border-gray-200 bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3 font-bold text-lg">
        Home
      </div>

      <div className="flex gap-3 p-4 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm">G</div>
        <div className="flex-1">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's happening!?"
            className="w-full resize-none bg-transparent text-gray-800 text-lg focus:outline-none"
          />
          <div className="flex justify-between items-center mt-2">
            {/* Icons */}
            <div className="flex gap-3 text-[#2ad14e]">
              <Image size={20} className="cursor-pointer hover:scale-110 transition" />
              <BarChart2 size={20} className="cursor-pointer hover:scale-110 transition" />
              <Smile size={20} className="cursor-pointer hover:scale-110 transition" />
              <MapPin size={20} className="cursor-pointer hover:scale-110 transition" />
            </div>
            <button
              onClick={handlePost}
              className="bg-[#2ad14e] text-white px-5 py-1.5 rounded-full font-semibold hover:bg-[#26b342] transition"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} className="flex gap-3 p-4 border-b border-gray-200 hover:bg-gray-50 transition">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm">G</div>

          {/* Post Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold text-black">{post.user}</span>
              <span>{post.handle}</span>
              <span>· {post.time}</span>
            </div>
            <p className="text-gray-800 mt-1">{post.text}</p>

            {/* Actions */}
            <div className="flex justify-between text-gray-500 mt-3 max-w-md">
              <button className="flex items-center gap-1 hover:text-[#2ad14e] transition">
                <MessageCircle size={18} /> 
              </button>
              <button className="flex items-center gap-1 hover:text-[#2ad14e] transition">
                <Heart size={18} /> 
              </button>
              <button className="flex items-center gap-1 hover:text-[#2ad14e] transition">
                <BarChart3 size={18} /> 
              </button>
              <button className="flex items-center gap-1 hover:text-[#2ad14e] transition">
                <Share size={18} /> 
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
