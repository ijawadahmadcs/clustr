"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Plus, Play } from "lucide-react";
import { openLoginModal } from "@/redux/slices/modalSlice";
import StoryModal from "./StoryModal";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all stories from last 24 hours
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const q = query(
      collection(db, "stories"),
      where("timestamp", ">", twentyFourHoursAgo),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedStories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Group stories by user
      const groupedStories = {};
      fetchedStories.forEach((story) => {
        if (!groupedStories[story.username]) {
          groupedStories[story.username] = [];
        }
        groupedStories[story.username].push(story);
      });

      setStories(groupedStories);

      // Set current user's stories
      if (user.username) {
        setUserStories(groupedStories[user.username] || []);
      }
    });

    return () => unsubscribe();
  }, [user.username]);

  const createStory = async (content) => {
    if (!user?.username) {
      dispatch(openLoginModal());
      return;
    }

    try {
      await addDoc(collection(db, "stories"), {
        text: content,
        username: user.username,
        name: user.name,
        timestamp: serverTimestamp(),
        views: [],
        type: "text", // Can be extended for image/video stories
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating story:", error);
    }
  };

  return (
    <>
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          {/* Create Story Button */}
          <div
            onClick={() => {
              if (!user?.username) {
                dispatch(openLoginModal());
                return;
              }
              setShowCreateModal(true);
            }}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400 group-hover:border-[#2ad14e] transition relative">
              <Plus size={24} className="text-gray-500 group-hover:text-[#2ad14e]" />
              {userStories.length > 0 && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#2ad14e] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{userStories.length}</span>
                </div>
              )}
            </div>
            <span className="text-xs mt-1 text-gray-600">Your Story</span>
          </div>

          {/* Other Users' Stories */}
          {Object.entries(stories)
            .filter(([username]) => username !== user.username)
            .map(([username, userStoryList]) => {
              const latestStory = userStoryList[0];
              const hasUnviewedStories = userStoryList.some(
                (story) => !story.views?.includes(user.uid)
              );

              return (
                <div
                  key={username}
                  onClick={() => setSelectedStory({ username, stories: userStoryList })}
                  className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold text-white relative ${
                      hasUnviewedStories
                        ? "bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5"
                        : "bg-gray-400"
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-full flex items-center justify-center ${
                        hasUnviewedStories ? "bg-white text-gray-800" : ""
                      }`}
                    >
                      {latestStory.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#2ad14e] rounded-full flex items-center justify-center">
                      <Play size={12} className="text-white" />
                    </div>
                  </div>
                  <span className="text-xs mt-1 text-gray-600 truncate w-16 text-center">
                    {latestStory.name}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <CreateStoryModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateStory={createStory}
        />
      )}

      {/* View Story Modal */}
      {selectedStory && (
        <StoryModal
          isOpen={!!selectedStory}
          onClose={() => setSelectedStory(null)}
          storyData={selectedStory}
          currentUser={user}
        />
      )}
    </>
  );
};

// Create Story Modal Component
const CreateStoryModal = ({ isOpen, onClose, onCreateStory }) => {
  const [content, setContent] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#2ad14e");

  const backgroundColors = [
    "#2ad14e",
    "#3b82f6",
    "#ef4444",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#10b981",
    "#f97316",
  ];

  const handleCreate = () => {
    if (content.trim()) {
      onCreateStory(content);
      setContent("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Story</h2>
        
        <div
          className="w-full h-64 rounded-xl p-4 flex items-center justify-center mb-4 relative"
          style={{ backgroundColor }}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something..."
            className="w-full h-full bg-transparent text-white text-center text-lg font-medium resize-none outline-none placeholder-white/80"
            maxLength={150}
          />
        </div>

        {/* Background Color Picker */}
        <div className="flex gap-2 mb-4">
          {backgroundColors.map((color) => (
            <button
              key={color}
              onClick={() => setBackgroundColor(color)}
              className={`w-8 h-8 rounded-full border-2 ${
                backgroundColor === color ? "border-gray-800" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!content.trim()}
            className="flex-1 py-2 px-4 bg-[#2ad14e] text-white rounded-full hover:bg-[#26b342] disabled:opacity-50"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stories;