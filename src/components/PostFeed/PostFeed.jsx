"use client";
import React from "react";

import PostInput from "../PostInput/PostInput";
import Post from "../Post/Post";

const PostFeed = () => {
  return (
    <div className="flex-1 min-h-screen border-x border-gray-200 bg-white">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3 font-bold text-lg">
        Home
      </div>
      <PostInput />
      {<Post />}
    </div>
  );
};

export default PostFeed;
