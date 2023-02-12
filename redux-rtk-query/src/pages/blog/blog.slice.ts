import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface BlogState {
  postId: string;
}

const initialState: BlogState = {
  postId: "",
};

const blogSlice = createSlice({
  name: "blog",
  initialState: initialState,
  reducers: {
    startEditPost: (state, action: PayloadAction<string>) => {
      state.postId = action.payload;
    },
    cancelEditPost: (state) => {
      state.postId = "";
    },
  },
});

export const { cancelEditPost, startEditPost } = blogSlice.actions;

const blogReducer = blogSlice.reducer;

export default blogReducer;
