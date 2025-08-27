"use client";
import { closeCommentModal, openLoginModal } from "@/redux/slices/modalSlice";
import { Modal } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "@/firebase";
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import moment from "moment";

const CommentModal = () => {
  const { commentModalOpen, selectedPost } = useSelector(
    (state) => state.modal
  );
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [reply, setReply] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!selectedPost) return;
    const unsub = onSnapshot(doc(db, "posts", selectedPost.id), (docSnap) => {
      if (docSnap.exists()) {
        setComments(docSnap.data().comments || []);
      }
    });
    return () => unsub();
  }, [selectedPost]);

  const handleSendReply = async () => {
    if (!user?.username) {
      dispatch(openLoginModal());
      return;
    }

    if (!reply.trim() || !selectedPost) return;

    const postRef = doc(db, "posts", selectedPost.id);
    await updateDoc(postRef, {
      comments: arrayUnion({
        text: reply,
        name: user.name,
        username: user.username,
        timestamp: new Date(),
      }),
    });

    setReply("");
  };

  return (
    <Modal
      className="flex justify-center items-center"
      open={commentModalOpen}
      onClose={() => dispatch(closeCommentModal())}
    >
      <div className="w-[500px] bg-white rounded-2xl p-5 shadow-2xl">
        {selectedPost && (
          <>
            <div className="flex gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{selectedPost?.name}</span>
                  <span className="text-gray-500">
                    @{selectedPost?.username}
                  </span>
                </div>
                <p className="text-gray-800">{selectedPost?.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Replying to{" "}
                  <span className="text-[#2ad14e]">
                    @{selectedPost?.username}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="w-full resize-none focus:outline-none text-gray-800 text-sm placeholder-gray-500"
                rows={3}
                placeholder="Post your reply"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSendReply}
                className="bg-[#2ad14e] text-white px-5 py-1.5 rounded-full font-medium hover:bg-green-600 transition"
              >
                Reply
              </button>
            </div>

            <div className="mt-6 space-y-4 max-h-60 overflow-y-auto">
              <p>Replies:</p>
              {comments.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-300"></div>
                  <div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">{c.name}</span>
                      <span className="text-gray-500">@{c.username}</span>
                      {c.timestamp && (
                        <span className="text-xs text-gray-400">
                          {moment(
                            c.timestamp.toDate
                              ? c.timestamp.toDate()
                              : c.timestamp
                          ).fromNow()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 text-sm">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CommentModal;
