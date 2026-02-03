"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { ArrowLeft, Send, Smile, Image } from "lucide-react";
import moment from "moment";

const MessageThread = () => {
  const params = useParams();
  const router = useRouter();
  const conversationId = params?.id;
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    if (!conversationId || !currentUser.username) return;

    // Get conversation details
    const getConversation = async () => {
      const convDoc = await getDoc(doc(db, "conversations", conversationId));
      if (convDoc.exists()) {
        const convData = convDoc.data();
        const otherUsername = convData.participants?.find((p) => p !== currentUser.username) ||
                             (convData.user1 === currentUser.username ? convData.user2 : convData.user1);
        
        // Get other user's profile
        const userDoc = await getDoc(doc(db, "users", otherUsername));
        if (userDoc.exists()) {
          setOtherUser({ username: otherUsername, ...userDoc.data() });
        }
      }
      setLoading(false);
    };

    getConversation();

    // Listen to messages
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [conversationId, currentUser.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser.username || !otherUser) return;

    try {
      // Add message
      await addDoc(collection(db, "messages"), {
        conversationId,
        text: newMessage,
        senderId: currentUser.username,
        senderName: currentUser.name,
        receiverId: otherUser.username,
        timestamp: serverTimestamp(),
        read: false,
      });

      // Update conversation
      const convRef = doc(db, "conversations", conversationId);
      await updateDoc(convRef, {
        lastMessage: newMessage,
        lastMessageTime: serverTimestamp(),
        lastMessageSender: currentUser.username,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen border-x border-gray-200 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2ad14e]"></div>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="flex-1 min-h-screen border-x border-gray-200 bg-white flex items-center justify-center">
        <p className="text-gray-500">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen border-x border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
            {otherUser.username?.[0]?.toUpperCase() || "U"}
          </div>
          
          <div>
            <h1 className="font-bold text-lg">{otherUser.name || otherUser.username}</h1>
            <p className="text-sm text-gray-500">@{otherUser.username}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No messages yet</p>
            <p className="text-sm text-gray-400">Start a conversation with {otherUser.name}</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === currentUser.username;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isOwnMessage
                      ? "bg-[#2ad14e] text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    isOwnMessage ? "text-green-100" : "text-gray-500"
                  }`}>
                    {message.timestamp && moment(message.timestamp.toDate()).format("HH:mm")}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${otherUser.name}...`}
              className="w-full resize-none bg-gray-100 rounded-2xl px-4 py-2 max-h-32 focus:outline-none focus:ring-2 focus:ring-[#2ad14e] focus:bg-white"
              rows={1}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-[#2ad14e] hover:bg-gray-100 rounded-full transition">
              <Image size={20} />
            </button>
            
            <button className="p-2 text-[#2ad14e] hover:bg-gray-100 rounded-full transition">
              <Smile size={20} />
            </button>
            
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-[#2ad14e] text-white rounded-full hover:bg-[#26b342] transition disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MessageList, MessageThread };