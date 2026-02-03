import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  bookmarkedPosts: [],
  stories: [],
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    addBookmark: (state, action) => {
      if (!state.bookmarkedPosts.includes(action.payload)) {
        state.bookmarkedPosts.push(action.payload);
      }
    },
    removeBookmark: (state, action) => {
      state.bookmarkedPosts = state.bookmarkedPosts.filter(
        id => id !== action.payload
      );
    },
    setBookmarks: (state, action) => {
      state.bookmarkedPosts = action.payload;
    },
    addStory: (state, action) => {
      state.stories.unshift(action.payload);
    },
    setStories: (state, action) => {
      state.stories = action.payload;
    },
    removeExpiredStories: (state) => {
      const now = new Date();
      state.stories = state.stories.filter(story => {
        const storyTime = new Date(story.timestamp?.seconds * 1000);
        return now - storyTime < 24 * 60 * 60 * 1000; // 24 hours
      });
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPosts,
  addPost,
  updatePost,
  deletePost,
  addBookmark,
  removeBookmark,
  setBookmarks,
  addStory,
  setStories,
  removeExpiredStories,
  setLoading,
  setError,
} = postsSlice.actions;

export default postsSlice.reducer;