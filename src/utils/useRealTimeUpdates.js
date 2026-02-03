"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase";
import {
  setNotifications,
  setUnreadCount,
} from "@/redux/slices/notificationsSlice";

export const useRealTimeNotifications = () => {
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentUser.username) return;

    const q = query(
      collection(db, "notifications"),
      where("toUser", "==", currentUser.username),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch(setNotifications(notifications));
      
      const unreadCount = notifications.filter((n) => !n.read).length;
      dispatch(setUnreadCount(unreadCount));
    });

    return () => unsubscribe();
  }, [currentUser.username, dispatch]);
};

