import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { extractMentions } from "./mentionUtils";

export const createNotification = async ({
  type,
  fromUser,
  fromUserName,
  toUser,
  postId = null,
  postText = null,
  additionalData = {}
}) => {
  try {
    // Validate required fields
    if (!type || !fromUser || !toUser) {
      console.warn("Missing required notification fields");
      return;
    }

    await addDoc(collection(db, "notifications"), {
      type,
      fromUser,
      fromUserName: fromUserName || fromUser,
      toUser,
      postId: postId || "",
      postText: postText || "",
      timestamp: serverTimestamp(),
      read: false,
      ...additionalData,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export const createMentionNotifications = async (text, currentUser, postId) => {
  if (!text || !currentUser?.username || !postId) return;
  
  const mentions = extractMentions(text);
  
  for (const username of mentions) {
    if (username !== currentUser.username) {
      await createNotification({
        type: "mention",
        fromUser: currentUser.username,
        fromUserName: currentUser.name || currentUser.username,
        toUser: username,
        postId,
        postText: text.slice(0, 50) + (text.length > 50 ? "..." : ""),
      });
    }
  }
};