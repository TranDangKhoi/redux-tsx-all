import { configureStore } from "@reduxjs/toolkit";
import blogSlice from "pages/blog/blog.slice";

export const store = configureStore({
  reducer: {
    blog: blogSlice,
  },
});

// Lấy RootState và AppDispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
