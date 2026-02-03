import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, { payload }) => { state.notifications = payload; },
    addNotification: (state, { payload }) => {
      state.notifications.unshift(payload);
      state.unreadCount++;
    },
    markAsRead: (state, { payload }) => {
      const n = state.notifications.find(n => n.id === payload);
      if (n && !n.read) {
        n.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
    },
    setUnreadCount: (state, { payload }) => { state.unreadCount = payload; },
    setLoading: (state, { payload }) => { state.loading = payload; },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  setUnreadCount,
  setLoading,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
