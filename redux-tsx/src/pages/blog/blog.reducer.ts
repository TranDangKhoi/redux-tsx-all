import { initialPostList } from "./../../constants/blog";
import { Post } from "./../../types/post.type";
import { createAction, createReducer, current } from "@reduxjs/toolkit";

interface BlogState {
  postList: Post[];
  editingPost: Post | null;
}

const initialState: BlogState = {
  postList: initialPostList,
  editingPost: null,
};

export const addPost = createAction<Post>("blog/addPost");
export const removePost = createAction<string>("blog/removePost");
export const startEditingPost = createAction<string>("blog/startEditingPost");
export const finishEditingPost = createAction<Post>("blog/finishEditingPost");
export const cancelEditingPost = createAction("blog/cancelEditingPost");

const blogReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      // ImmerJS: giúp chúng ta mutate một state an toàn
      const post = action.payload;
      state.postList.push(post);
    })
    .addCase(removePost, (state, action) => {
      const postIdToBeDelted = action.payload;
      const newPostList = state.postList.filter(
        (post) => post.id !== postIdToBeDelted
      );
      state.postList = newPostList;
      state.editingPost = null;
    })
    .addCase(startEditingPost, (state, action) => {
      const postId = action.payload;
      const foundPost =
        state.postList.find((post) => post.id === postId) || null;
      state.editingPost = foundPost;
    })
    .addCase(cancelEditingPost, (state) => {
      state.editingPost = null;
    })
    .addCase(finishEditingPost, (state, action) => {
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
    })
    .addMatcher(
      (action) => action.type.includes("cancel"),
      (state, action) => {
        console.log(current(state));
      }
    );
});

export default blogReducer;
