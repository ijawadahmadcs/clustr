// src/redux/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice.js";
import modalReducer from "@/redux/slices/modalSlice.js";
import userSlice from "@/redux/slices/userSlice.js";
import postsReducer from "@/redux/slices/postsSlice.js";
import messagesReducer from "@/redux/slices/messagesSlice.js";
import notificationsReducer from "@/redux/slices/notificationsSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    user: userSlice,
    posts: postsReducer,
    messages: messagesReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Firebase timestamps and other non-serializable values
        ignoredActions: [
          'posts/setPosts',
          'posts/addPost',
          'posts/updatePost',
          'messages/setMessages',
          'messages/addMessage',
          'notifications/setNotifications',
          'notifications/addNotification',
        ],
        ignoredPaths: [
          'posts.posts',
          'messages.messages',
          'notifications.notifications',
        ],
      },
    }),
});

export default store;