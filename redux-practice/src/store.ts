import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { blogApi } from "./pages/Blog/blog.service";
import blogReducer from "./pages/Blog/blog.slice";

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer,
  },
  middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(blogApi.middleware),
});

// Lấy RootState và AppDispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
