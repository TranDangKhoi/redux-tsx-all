import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    startEditMode: (state, action: PayloadAction<string>) => {
      state.postId = action.payload;
    },
    finishedEditMode: (state) => {
      state.postId = "";
    },
  },
});

export const { finishedEditMode, startEditMode } = blogSlice.actions;

const blogReducer = blogSlice.reducer;

export default blogReducer;
