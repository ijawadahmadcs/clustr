"use client";
import { closeCommentModal } from "@/redux/slices/modalSlice";
import { Modal } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const CommentModal = () => {
  const open = useSelector((state) => state.modal.commentModalOpen); // lowercase
  const dispatch = useDispatch();

  return (
    <Modal
      className="flex justify-center items-center"
      open={open}
      onClose={() => dispatch(closeCommentModal())}
    >
      <div className="w-[400px] h-[400px] bg-white text-black">
        comment modal
      </div>
    </Modal>
  );
};

export default CommentModal;
