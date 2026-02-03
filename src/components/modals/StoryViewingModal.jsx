"use client";
import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase";
import moment from "moment";

const StoryModal = ({ isOpen, onClose, storyData, currentUser }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const { username, stories } = storyData;
  const currentStory = stories[currentStoryIndex];

  useEffect(() => {
    if (!isOpen || !currentStory) return;

    // Mark story as viewed
    const markAsViewed = async () => {
      if (!currentUser.uid || currentStory.views?.includes(currentUser.uid)) return;

      try {
        const storyRef = doc(db, "stories", currentStory.id);
        await updateDoc(storyRef, {
          views: arrayUnion(currentUser.uid),
        });
      } catch (error) {
        console.error("Error marking story as viewed:", error);
      }
    };

    markAsViewed();

    // Auto-advance story after 5 seconds
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + 2; // 2% every 100ms = 5 seconds total
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentStoryIndex, isOpen, currentStory, currentUser.uid]);

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    }
  };

  const goToStory = (index) => {
    setCurrentStoryIndex(index);
    setProgress(0);
  };

  if (!isOpen || !currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative w-full max-w-sm h-full max-h-[80vh] bg-black rounded-lg overflow-hidden">
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
          {stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden cursor-pointer"
              onClick={() => goToStory(index)}
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-100"
                style={{
                  width: index < currentStoryIndex ? "100%" : 
                         index === currentStoryIndex ? `${progress}%` : "0%"
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
              {username?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{currentStory.name}</p>
              <p className="text-gray-300 text-xs">
                {moment(currentStory.timestamp?.toDate()).fromNow()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Story Content */}
        <div 
          className="w-full h-full flex items-center justify-center p-8 text-center"
          style={{ backgroundColor: currentStory.backgroundColor || "#2ad14e" }}
        >
          <p className="text-white text-xl font-medium leading-relaxed">
            {currentStory.text}
          </p>
        </div>

        {/* Navigation */}
        <button
          onClick={prevStory}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition"
          disabled={currentStoryIndex === 0}
        >
          <ChevronLeft size={32} />
        </button>

        <button
          onClick={nextStory}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition"
        >
          <ChevronRight size={32} />
        </button>

        {/* Click areas for navigation */}
        <div className="absolute inset-0 flex">
          <div 
            className="w-1/3 h-full cursor-pointer" 
            onClick={prevStory}
          />
          <div 
            className="w-1/3 h-full cursor-pointer" 
            onClick={() => setProgress(0)}
          />
          <div 
            className="w-1/3 h-full cursor-pointer" 
            onClick={nextStory}
          />
        </div>

        {/* Story Info */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center justify-between text-xs">
            <span>{currentStory.views?.length || 0} views</span>
            <span>{currentStoryIndex + 1} of {stories.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;