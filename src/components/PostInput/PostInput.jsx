"use client";
import { db } from "@/firebase";
import { openLoginModal } from "@/redux/slices/modalSlice";
import { addDoc, collection, serverTimestamp, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { BarChart2, Image, MapPin, Smile, Plus, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { extractMentions, extractHashtags } from "@/utils/mentionUtils";
import { createMentionNotifications } from "@/utils/notificationUtils";

const PostInput = ({ threadParent = null, onThreadPost = null }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [text, setText] = useState("");
  const [isThreadMode, setIsThreadMode] = useState(false);
  const [threadPosts, setThreadPosts] = useState([]);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);

  const characterLimit = 280;
  const remainingChars = characterLimit - text.length;

  // Mock user suggestions - in real app, fetch from Firestore
  const mockUsers = [
    { username: "john_doe", name: "John Doe" },
    { username: "jane_smith", name: "Jane Smith" },
    { username: "tech_guru", name: "Tech Guru" },
  ];

  useEffect(() => {
    const lastAtSymbol = text.lastIndexOf('@', cursorPosition);
    if (lastAtSymbol !== -1 && lastAtSymbol === cursorPosition - 1) {
      setShowMentionSuggestions(true);
      setMentionSuggestions(mockUsers);
    } else if (lastAtSymbol !== -1) {
      const searchTerm = text.slice(lastAtSymbol + 1, cursorPosition).toLowerCase();
      if (searchTerm && !searchTerm.includes(' ')) {
        const filtered = mockUsers.filter(user => 
          user.username.toLowerCase().includes(searchTerm) ||
          user.name.toLowerCase().includes(searchTerm)
        );
        setMentionSuggestions(filtered);
        setShowMentionSuggestions(filtered.length > 0);
      } else {
        setShowMentionSuggestions(false);
      }
    } else {
      setShowMentionSuggestions(false);
    }
  }, [text, cursorPosition]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= characterLimit) {
      setText(newText);
      setCursorPosition(e.target.selectionStart);
    }
  };

  const insertMention = (username) => {
    const lastAtSymbol = text.lastIndexOf('@', cursorPosition);
    const beforeAt = text.slice(0, lastAtSymbol);
    const afterCursor = text.slice(cursorPosition);
    const newText = `${beforeAt}@${username} ${afterCursor}`;
    
    setText(newText);
    setShowMentionSuggestions(false);
    
    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = beforeAt.length + username.length + 2;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const addToThread = () => {
    setIsThreadMode(true);
    setThreadPosts([...threadPosts, text]);
    setText("");
  };

  const removeFromThread = (index) => {
    const newThreadPosts = threadPosts.filter((_, i) => i !== index);
    setThreadPosts(newThreadPosts);
    if (newThreadPosts.length === 0) {
      setIsThreadMode(false);
    }
  };

  const sendPost = async () => {
    if (!user?.username) {
      dispatch(openLoginModal());
      return;
    }

    if (!text.trim() && threadPosts.length === 0) return;

    try {
      let threadId = null;

      // If it's a thread, create all posts
      if (isThreadMode || threadPosts.length > 0) {
        threadId = `thread_${Date.now()}_${user.username}`;
        const allPosts = [...threadPosts, text].filter(post => post.trim());

        for (let i = 0; i < allPosts.length; i++) {
          const postText = allPosts[i];
          const docRef = await addDoc(collection(db, "posts"), {
            text: postText,
            name: user.name,
            username: user.username,
            timestamp: serverTimestamp(),
            likes: [],
            comments: [],
            retweets: [],
            threadId: threadId,
            threadIndex: i,
            threadTotal: allPosts.length,
            mentions: extractMentions(postText),
            hashtags: extractHashtags(postText),
            parentPost: threadParent?.id || null,
          });

          // Create mention notifications
          await createMentionNotifications(postText, user, docRef.id);
        }
      } else {
        // Single post
        const docRef = await addDoc(collection(db, "posts"), {
          text,
          name: user.name,
          username: user.username,
          timestamp: serverTimestamp(),
          likes: [],
          comments: [],
          retweets: [],
          mentions: extractMentions(text),
          hashtags: extractHashtags(text),
          parentPost: threadParent?.id || null,
        });

        // Create mention notifications
        await createMentionNotifications(text, user, docRef.id);

        // If replying to a thread parent, update parent's replies
        if (threadParent && onThreadPost) {
          await updateDoc(doc(db, "posts", threadParent.id), {
            replies: arrayUnion(docRef.id),
          });
          onThreadPost();
        }
      }

      // Reset form
      setText("");
      setThreadPosts([]);
      setIsThreadMode(false);
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  const getCharacterCountColor = () => {
    if (remainingChars < 20) return "text-red-500";
    if (remainingChars < 50) return "text-yellow-500";
    return "text-gray-500";
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      {/* Thread Preview */}
      {threadPosts.length > 0 && (
        <div className="px-4 pt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>Thread ({threadPosts.length + 1} posts)</span>
          </div>
          {threadPosts.map((post, index) => (
            <div key={index} className="flex gap-3 relative">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                {user.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-800">{post}</p>
                <button
                  onClick={() => removeFromThread(index)}
                  className="absolute top-1 right-1 p-1 hover:bg-gray-200 rounded-full transition"
                >
                  <X size={14} className="text-gray-500" />
                </button>
              </div>
              {/* Thread line */}
              <div className="absolute left-4 top-8 w-0.5 h-4 bg-gray-300"></div>
            </div>
          ))}
        </div>
      )}

      {/* Main Input */}
      <div className="flex gap-3 p-4 relative">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm">
          {user.username?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onSelect={(e) => setCursorPosition(e.target.selectionStart)}
              onClick={(e) => setCursorPosition(e.target.selectionStart)}
              onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
              placeholder={
                threadPosts.length > 0 
                  ? `Add another post to your thread...`
                  : threadParent 
                    ? `Reply to ${threadParent.username}...`
                    : "What's happening!?"
              }
              className="w-full resize-none bg-transparent text-gray-800 text-lg focus:outline-none min-h-[50px]"
              rows={3}
              maxLength={characterLimit}
            />

            {/* Mention Suggestions */}
            {showMentionSuggestions && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {mentionSuggestions.map((user) => (
                  <button
                    key={user.username}
                    onClick={() => insertMention(user.username)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-gray-500 text-xs">@{user.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

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
              
              {/* Thread button */}
              {!threadParent && text.trim() && (
                <button
                  onClick={addToThread}
                  className="flex items-center gap-1 text-[#2ad14e] hover:bg-[#2ad14e]/10 px-2 py-1 rounded-full transition"
                  title="Add to thread"
                >
                  <Plus size={16} />
                  <span className="text-sm">Thread</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Character count */}
              <div className="flex items-center gap-2">
                <span className={`text-sm ${getCharacterCountColor()}`}>
                  {remainingChars}
                </span>
                <div className="w-8 h-8 relative">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-200"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className={getCharacterCountColor()}
                      strokeDasharray={`${(text.length / characterLimit) * 62.83} 62.83`}
                    />
                  </svg>
                </div>
              </div>

              <button
                disabled={!text.trim() && threadPosts.length === 0}
                onClick={sendPost}
                className="bg-[#2ad14e] text-white px-5 py-1.5 rounded-full font-semibold hover:bg-[#26b342] transition disabled:bg-[#26b342]/60"
              >
                {threadPosts.length > 0 ? "Post thread" : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostInput;