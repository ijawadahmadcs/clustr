"use client";

import React, { useEffect, useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { MessageCircle, Heart, BarChart3, Share } from "lucide-react";
import moment from "moment/moment";
import { openCommentModal, openLoginModal } from "@/redux/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";

const Post = ({ data, id }) => {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);
  const user = useSelector((state) => state.user);

  async function likePost(post) {
    if (!user?.username) {
      dispatch(openLoginModal());
      return;
    }

    const postRef = doc(db, "posts", post.id);

    if (post.likes?.includes(user.uid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user.uid),
      });
    }
  }

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex gap-3 p-4 border-b border-gray-200 hover:bg-gray-50 transition"
        >
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm">
            {post?.username?.[0]?.toUpperCase() || "U"}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold text-black">{post?.name}</span>
              <span>@{post?.username}</span>
              {post.timestamp && (
                <span>{moment(post.timestamp.toDate()).fromNow()}</span>
              )}
            </div>
            <p className="text-gray-800 mt-1">{post?.text}</p>

            <div className="flex justify-between text-gray-500 mt-3 max-w-md">
              <button
                onClick={() => dispatch(openCommentModal(post))}
                className="flex items-center gap-1 hover:text-[#2ad14e] transition"
              >
                <MessageCircle size={18} />
                <span>{post.comments?.length || 0}</span>
              </button>

              <button
                onClick={() => likePost(post)}
                className="flex items-center gap-1 hover:text-[#2ad14e] transition"
              >
                <Heart size={18} />
                <span>{post.likes?.length || 0}</span>
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

export default Post;
