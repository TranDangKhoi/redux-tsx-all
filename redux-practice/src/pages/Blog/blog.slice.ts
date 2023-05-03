import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "src/types/post.type";

type TInitialState = {
  postId: string;
};

const initialState: TInitialState = {
  postId: "",
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    startEditPost: (state, action: PayloadAction<string>) => {
      state.postId = action.payload;
    },
    finishEditPost: (state, action: PayloadAction<string>) => {
      state.postId = "";
    },
  },
});

export const { finishEditPost, startEditPost } = blogSlice.actions;
const blogReducer = blogSlice.reducer;
export default blogReducer;
