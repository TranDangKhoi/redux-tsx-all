import { blogApi } from "./pages/blog/blog.service";
import blogReducer from "pages/blog/blog.slice";
import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { rtkQueryErrorLogger } from "middleware";

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer, // thêm reducer được tạo từ API slice
  },
  // Thêm api middleware để enable các tishn năng như caching, invalidation, polling, refresh
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(blogApi.middleware, rtkQueryErrorLogger),
});

// Optional, nhưng bắt buộc nếu dùng tính năng refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Lấy RootState và AppDispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
