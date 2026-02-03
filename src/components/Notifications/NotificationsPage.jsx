// src/components/Notifications/NotificationsPage.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Heart, MessageCircle, Repeat2, UserPlus, Settings } from "lucide-react";
import moment from "moment";
import Link from "next/link";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser.username) return;

    const q = query(
      collection(db, "notifications"),
      where("toUser", "==", currentUser.username),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notifs);
      setLoading(false);

      // Mark notifications as read after viewing
      notifs
        .filter((n) => !n.read)
        .forEach(async (notification) => {
          const notifRef = doc(db, "notifications", notification.id);
          await updateDoc(notifRef, { read: true });
        });
    });

    return () => unsubscribe();
  }, [currentUser.username]);

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "mentions") return notification.type === "mention";
    return notification.type === activeTab;
  });

  const tabs = [
    { id: "all", label: "All", count: notifications.length },
    { 
      id: "mentions", 
      label: "Mentions", 
      count: notifications.filter(n => n.type === "mention").length 
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart size={20} className="text-red-500" fill="currentColor" />;
      case "retweet":
        return <Repeat2 size={20} className="text-green-500" />;
      case "comment":
        return <MessageCircle size={20} className="text-blue-500" />;
      case "follow":
        return <UserPlus size={20} className="text-purple-500" />;
      case "mention":
        return <MessageCircle size={20} className="text-[#2ad14e]" />;
      default:
        return <MessageCircle size={20} className="text-gray-500" />;
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case "like":
        return `liked your post`;
      case "retweet":
        return `retweeted your post`;
      case "comment":
        return `replied to your post`;
      case "follow":
        return `started following you`;
      case "mention":
        return `mentioned you in a post`;
      default:
        return `interacted with your content`;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen border-x border-gray-200 bg-white">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3 font-bold text-lg">
          Notifications
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-bold text-xl">Notifications</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 -mb-3">
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
      </div>

      {/* Notifications */}
      {filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MessageCircle size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Nothing to see here — yet
          </h2>
          <p className="text-gray-600 max-w-sm">
            {activeTab === "all" 
              ? "When someone likes, retweets, or replies to your posts, you'll see it here."
              : `No ${activeTab} notifications yet.`}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 p-4 hover:bg-gray-50 transition cursor-pointer ${
                !notification.read ? "bg-blue-50/30" : ""
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Profile Picture */}
              <Link href={`/profile/${notification.fromUser}`}>
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs cursor-pointer hover:opacity-80 transition">
                  {notification.fromUser?.[0]?.toUpperCase() || "U"}
                </div>
              </Link>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-sm">
                  <Link
                    href={`/profile/${notification.fromUser}`}
                    className="font-semibold text-black hover:underline"
                  >
                    {notification.fromUserName || notification.fromUser}
                  </Link>
                  <span className="text-gray-600">
                    {getNotificationText(notification)}
                  </span>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-[#2ad14e] rounded-full ml-2"></div>
                  )}
                </div>

                {/* Post preview */}
                {notification.postText && (
                  <p className="text-gray-600 text-sm mt-1 truncate">
                    "{notification.postText}"
                  </p>
                )}

                {/* Timestamp */}
                <p className="text-gray-500 text-xs mt-1">
                  {notification.timestamp && 
                    moment(notification.timestamp.toDate()).fromNow()}
                </p>
              </div>

              {/* Post link */}
              {notification.postId && (
                <Link href={`/post/${notification.postId}`}>
                  <button className="text-[#2ad14e] text-sm hover:underline">
                    View
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;