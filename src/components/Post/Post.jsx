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
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { 
  MessageCircle, 
  Heart, 
  BarChart3, 
  Share, 
  Bookmark,
  Repeat2,
  MoreHorizontal,
  Quote
} from "lucide-react";
import moment from "moment/moment";
import { openCommentModal, openLoginModal } from "@/redux/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

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

  // Load user bookmarks
  useEffect(() => {
    if (!user?.username) return;

    const userDoc = doc(db, "users", user.username);
    const unsubscribe = onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        setBookmarkedPosts(doc.data().bookmarks || []);
      }
    });

    return () => unsubscribe();
  }, [user?.username]);

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

      // Create notification for post owner
      if (post.username !== user.username) {
        await addDoc(collection(db, "notifications"), {
          type: "like",
          fromUser: user.username,
          fromUserName: user.name,
          toUser: post.username,
          postId: post.id,
          postText: post.text.slice(0, 50) + (post.text.length > 50 ? "..." : ""),
          timestamp: serverTimestamp(),
          read: false,
        });
      }
    }
  }

  async function bookmarkPost(postId) {
    if (!user?.username) {
      dispatch(openLoginModal());
      return;
    }

    const userRef = doc(db, "users", user.username);
    const isBookmarked = bookmarkedPosts.includes(postId);

    if (isBookmarked) {
      await updateDoc(userRef, {
        bookmarks: arrayRemove(postId),
      });
    } else {
      await updateDoc(userRef, {
        bookmarks: arrayUnion(postId),
      });
    }
  }

  async function retweetPost(post) {
    if (!user?.username) {
      dispatch(openLoginModal());
      return;
    }

    // Simple retweet - creates a new post referencing the original
    await addDoc(collection(db, "posts"), {
      type: "retweet",
      originalPost: post.id,
      originalAuthor: post.username,
      originalText: post.text,
      originalTimestamp: post.timestamp,
      username: user.username,
      name: user.name,
      timestamp: serverTimestamp(),
      likes: [],
      comments: [],
      retweets: [],
    });

    // Update original post retweet count
    const postRef = doc(db, "posts", post.id);
    await updateDoc(postRef, {
      retweets: arrayUnion(user.uid),
    });

    // Create notification
    if (post.username !== user.username) {
      await addDoc(collection(db, "notifications"), {
        type: "retweet",
        fromUser: user.username,
        fromUserName: user.name,
        toUser: post.username,
        postId: post.id,
        postText: post.text.slice(0, 50) + (post.text.length > 50 ? "..." : ""),
        timestamp: serverTimestamp(),
        read: false,
      });
    }
  }

  const parseTextWithMentionsAndHashtags = (text) => {
    if (!text) return text;

    return text.split(/(\s+)/).map((word, index) => {
      if (word.startsWith('@')) {
        const username = word.slice(1);
        return (
          <Link
            key={index}
            href={`/profile/${username}`}
            className="text-[#2ad14e] hover:underline cursor-pointer"
          >
            {word}
          </Link>
        );
      } else if (word.startsWith('#')) {
        return (
          <Link
            key={index}
            href={`/hashtag/${word.slice(1)}`}
            className="text-[#2ad14e] hover:underline cursor-pointer"
          >
            {word}
          </Link>
        );
      }
      return word;
    });
  };

  const renderPost = (post) => {
    const isRetweet = post.type === "retweet";
    const isBookmarked = bookmarkedPosts.includes(post.id);

    return (
      <div key={post.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
        {isRetweet && (
          <div className="flex items-center gap-2 px-4 pt-3 text-gray-500 text-sm">
            <Repeat2 size={16} />
            <span>{post.name} retweeted</span>
          </div>
        )}
        
        <div className="flex gap-3 p-4">
          {/* Profile Picture */}
          <Link href={`/profile/${isRetweet ? post.originalAuthor : post.username}`}>
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm cursor-pointer hover:opacity-80 transition">
              {(isRetweet ? post.originalAuthor : post.username)?.[0]?.toUpperCase() || "U"}
            </div>
          </Link>

          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link
                href={`/profile/${isRetweet ? post.originalAuthor : post.username}`}
                className="font-semibold text-black hover:underline cursor-pointer"
              >
                {isRetweet ? post.originalAuthor : post.name}
              </Link>

              <Link
                href={`/profile/${isRetweet ? post.originalAuthor : post.username}`}
                className="hover:underline cursor-pointer text-gray-500 text-[12px]"
              >
                @{isRetweet ? post.originalAuthor : post.username}
              </Link>

              {(isRetweet ? post.originalTimestamp : post.timestamp) && (
                <span className="text-gray-500 text-xs">
                  • {moment((isRetweet ? post.originalTimestamp : post.timestamp).toDate()).fromNow()}
                </span>
              )}
            </div>

            {/* Post content with mentions and hashtags */}
            <p className="text-gray-800 mt-1">
              {parseTextWithMentionsAndHashtags(isRetweet ? post.originalText : post.text)}
            </p>

            {/* Thread indicator */}
            {post.threadId && (
              <div className="mt-2 text-sm text-[#2ad14e] cursor-pointer hover:underline">
                Show this thread
              </div>
            )}

            <div className="flex justify-around text-gray-500 mt-3 max-w-md w-full">
              {/* Comment */}
              <button
                onClick={() => dispatch(openCommentModal(post))}
                className="flex items-center gap-1 hover:text-[#2ad14e] transition group"
              >
                <div className="p-2 rounded-full group-hover:bg-[#2ad14e]/10">
                  <MessageCircle size={18} />
                </div>
                <span>{post.comments?.length || 0}</span>
              </button>

              {/* Retweet */}
              <button
                onClick={() => retweetPost(post)}
                className={`flex items-center gap-1 hover:text-[#2ad14e] transition group ${
                  post.retweets?.includes(user.uid) ? "text-[#2ad14e]" : ""
                }`}
              >
                <div className="p-2 rounded-full group-hover:bg-[#2ad14e]/10">
                  <Repeat2 size={18} />
                </div>
                <span>{post.retweets?.length || 0}</span>
              </button>

              {/* Like */}
              <button
                onClick={() => likePost(post)}
                className={`flex items-center gap-1 hover:text-red-500 transition group ${
                  post.likes?.includes(user.uid) ? "text-red-500" : ""
                }`}
              >
                <div className="p-2 rounded-full group-hover:bg-red-500/10">
                  <Heart
                    size={18}
                    fill={post.likes?.includes(user.uid) ? "currentColor" : "none"}
                  />
                </div>
                <span>{post.likes?.length || 0}</span>
              </button>

              {/* Views */}
              <button className="flex items-center gap-1 hover:text-[#2ad14e] transition group">
                <div className="p-2 rounded-full group-hover:bg-[#2ad14e]/10">
                  <BarChart3 size={18} />
                </div>
              </button>

              {/* More options */}
              <div className="flex items-center gap-1">
                {/* Bookmark */}
                <button
                  onClick={() => bookmarkPost(post.id)}
                  className={`p-2 rounded-full hover:bg-[#2ad14e]/10 transition ${
                    isBookmarked ? "text-[#2ad14e]" : "hover:text-[#2ad14e]"
                  }`}
                >
                  <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
                </button>

                {/* Share */}
                <button className="p-2 rounded-full hover:bg-[#2ad14e]/10 hover:text-[#2ad14e] transition">
                  <Share size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {posts.map(renderPost)}
    </div>
  );
};

export default Post;