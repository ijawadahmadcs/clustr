"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  or,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Search, MessageCircle } from "lucide-react";
import moment from "moment";
import Link from "next/link";

const MessageList = () => {
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser.username) return;

    const q = query(
      collection(db, "conversations"),
      or(
        where("participants", "array-contains", currentUser.username),
        where("user1", "==", currentUser.username),
        where("user2", "==", currentUser.username)
      ),
      orderBy("lastMessageTime", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversations(convos);
    });

    return () => unsubscribe();
  }, [currentUser.username]);

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = conv.participants?.find((p) => p !== currentUser.username) || 
                     (conv.user1 === currentUser.username ? conv.user2 : conv.user1);
    return otherUser?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex-1 min-h-screen border-x border-gray-200 bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3">
        <h1 className="font-bold text-xl mb-4">Messages</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Direct Messages"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:bg-white focus:ring-2 focus:ring-[#2ad14e]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="divide-y divide-gray-200">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <MessageCircle size={64} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to your inbox!</h2>
            <p className="text-gray-600 mb-6">
              Drop a line, share posts and more with private conversations between you and others on Clustr.
            </p>
            <button className="bg-[#2ad14e] text-white px-6 py-2 rounded-full font-medium hover:bg-[#26b342] transition">
              Write a message
            </button>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const otherUser = conversation.participants?.find((p) => p !== currentUser.username) || 
                             (conversation.user1 === currentUser.username ? conversation.user2 : conversation.user1);
            
            return (
              <Link key={conversation.id} href={`/messages/${conversation.id}`}>
                <div className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition">
                  {/* Profile Picture */}
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold">
                    {otherUser?.[0]?.toUpperCase() || "U"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.otherUserName || otherUser}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {conversation.lastMessageTime && 
                          moment(conversation.lastMessageTime.toDate()).format("MMM D")}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm truncate">
                      {conversation.lastMessage || "Start a conversation"}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {conversation.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-[#2ad14e] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};