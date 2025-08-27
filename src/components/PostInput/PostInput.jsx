"use client";
import { db } from "@/firebase";
import { openLoginModal } from "@/redux/slices/modalSlice";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { BarChart2, Image, MapPin, Smile } from "lucide-react";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PostInput = () => {
  const dispatch = useDispatch();
  const name = useSelector((state) => state.user.name);
  const [text, setText] = useState("");
  const user = useSelector((state) => state.user);
  async function sendPost() {
    if (!user?.username) {
      dispatch(openLoginModal());
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        text,
        name: user.name,
        username: user.username,
        timestamp: serverTimestamp(),
        likes: [],
        comments: [],
      });
      setText("");
    } catch (error) {
      console.error("Error posting:", error);
    }
  }

  return (
    <div className="flex gap-3 p-4 border-b border-gray-200">
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm">
        G
      </div>
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening!?"
          className="w-full resize-none bg-transparent text-gray-800 text-lg focus:outline-none"
        />
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-3 text-[#2ad14e]">
            <Image
              size={20}
              className="cursor-pointer hover:scale-110 transition"
            />
            <BarChart2
              size={20}
              className="cursor-pointer hover:scale-110 transition"
            />
            <Smile
              size={20}
              className="cursor-pointer hover:scale-110 transition"
            />
            <MapPin
              size={20}
              className="cursor-pointer hover:scale-110 transition"
            />
          </div>
          <button
            disabled={!text}
            onClick={() => sendPost()}
            className="bg-[#2ad14e] text-white px-5 py-1.5 rounded-full font-semibold hover:bg-[#26b342] transition disabled:bg-[#26b342]/60"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostInput;
