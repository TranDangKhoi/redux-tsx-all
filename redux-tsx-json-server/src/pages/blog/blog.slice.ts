import { initialPostList } from "../../constants/blog";
import { Post } from "../../types/post.type";
import { createSlice, nanoid, PayloadAction, current } from "@reduxjs/toolkit";

interface BlogState {
  postList: Post[];
  editingPost: Post | null;
}

const initialState: BlogState = {
  postList: initialPostList,
  editingPost: null,
};
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    removePost: (state, action: PayloadAction<string>) => {
      const postIdToBeDelted = action.payload;
      const newPostList = state.postList.filter(
        (post) => post.id !== postIdToBeDelted
      );
      state.postList = newPostList;
      state.editingPost = null;
    },
    startEditingPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const foundPost =
        state.postList.find((post) => post.id === postId) || null;
      state.editingPost = foundPost;
    },
    cancelEditingPost: (state) => {
      state.editingPost = null;
    },
    finishEditingPost: (state, action: PayloadAction<Post>) => {
      const postId = action.payload.id;
      state.postList.some((post, index) => {
        if (post.id === postId) {
          state.postList[index] = action.payload;
          state.editingPost = null;
          return true;
        }
        state.editingPost = null;
        return false;
      });
    },
    addPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        const post = action.payload;
        state.postList.push(post);
      },
      prepare: (post: Omit<Post, "id">) => ({
        payload: {
          ...post,
          id: nanoid(),
          createdAt: new Date().toDateString(),
        },
      }),
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      (action) => action.type.includes("cancel"),
      (state, action) => {
        console.log(current(state));
      }
    );
  },
});

export const {
  addPost,
  cancelEditingPost,
  finishEditingPost,
  removePost,
  startEditingPost,
} = blogSlice.actions;

const blogReducer = blogSlice.reducer;
export default blogReducer;
