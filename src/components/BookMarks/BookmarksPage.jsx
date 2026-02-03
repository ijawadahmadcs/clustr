// src/components/Bookmarks/BookmarksPage.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Bookmark, MoreHorizontal, Share, Trash2 } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { openCommentModal } from "@/redux/slices/modalSlice";

const BookmarksPage = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentUser.username) return;

    // Get user's bookmarked post IDs
    const userRef = doc(db, "users", currentUser.username);
    const unsubscribeUser = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const bookmarks = doc.data().bookmarks || [];
        setUserBookmarks(bookmarks);

        // Get the actual posts
        if (bookmarks.length > 0) {
          const postsRef = collection(db, "posts");
          const q = query(
            postsRef,
            where("__name__", "in", bookmarks),
            orderBy("timestamp", "desc")
          );

          const unsubscribePosts = onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            
            // Sort by bookmark order (most recent bookmark first)
            const sortedPosts = posts.sort((a, b) => {
              const aIndex = bookmarks.indexOf(a.id);
              const bIndex = bookmarks.indexOf(b.id);
              return aIndex - bIndex;
            });
            
            setBookmarkedPosts(sortedPosts);
            setLoading(false);
          });

          return () => unsubscribePosts();
        } else {
          setBookmarkedPosts([]);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeUser();
  }, [currentUser.username]);

  const removeBookmark = async (postId) => {
    if (!currentUser.username) return;

    try {
      const userRef = doc(db, "users", currentUser.username);
      await updateDoc(userRef, {
        bookmarks: arrayRemove(postId),
      });
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

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

  if (loading) {
    return (
      <div className="flex-1 min-h-screen border-x border-gray-200 bg-white">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3 font-bold text-lg">
          Bookmarks
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2ad14e]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen border-x border-gray-200 bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl">Bookmarks</h1>
            <p className="text-sm text-gray-500">@{currentUser.username}</p>
          </div>
          
          {bookmarkedPosts.length > 0 && (
            <button className="text-[#2ad14e] text-sm hover:underline">
              Clear all bookmarks
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {bookmarkedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <Bookmark size={64} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Save posts for later</h2>
          <p className="text-gray-600 max-w-sm">
            Bookmark posts to easily find them again. Don't let the good ones get away.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {bookmarkedPosts.map((post) => (
            <div
              key={post.id}
              className="flex gap-3 p-4 hover:bg-gray-50 transition relative group"
            >
              {/* Profile Picture */}
              <Link href={`/profile/${post.username}`}>
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm cursor-pointer hover:opacity-80 transition">
                  {post.username?.[0]?.toUpperCase() || "U"}
                </div>
              </Link>

              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Link
                    href={`/profile/${post.username}`}
                    className="font-semibold text-black hover:underline cursor-pointer"
                  >
                    {post.name}
                  </Link>

                  <Link
                    href={`/profile/${post.username}`}
                    className="hover:underline cursor-pointer text-gray-500 text-[12px]"
                  >
                    @{post.username}
                  </Link>

                  {post.timestamp && (
                    <span className="text-gray-500 text-xs">
                      • {moment(post.timestamp.toDate()).fromNow()}
                    </span>
                  )}
                </div>

                {/* Post content with mentions and hashtags */}
                <p className="text-gray-800 mt-1">
                  {parseTextWithMentionsAndHashtags(post.text)}
                </p>

                {/* Engagement stats */}
                <div className="flex items-center gap-4 text-gray-500 text-sm mt-3">
                  <button
                    onClick={() => dispatch(openCommentModal(post))}
                    className="hover:text-[#2ad14e] transition"
                  >
                    {post.comments?.length || 0} replies
                  </button>
                  
                  <span>{post.retweets?.length || 0} retweets</span>
                  <span>{post.likes?.length || 0} likes</span>
                </div>
              </div>

              {/* Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-2">
                <button
                  onClick={() => removeBookmark(post.id)}
                  className="p-2 hover:bg-red-100 hover:text-red-600 rounded-full transition"
                  title="Remove bookmark"
                >
                  <Trash2 size={16} />
                </button>

                <button className="p-2 hover:bg-gray-100 rounded-full transition">
                  <Share size={16} />
                </button>

                <button className="p-2 hover:bg-gray-100 rounded-full transition">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;