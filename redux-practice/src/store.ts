import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { useDispatch } from "react-redux";
import { rtkQueryErrorLogger } from "../../redux-rtk-query/src/middleware";
import { blogApi } from "./pages/Blog/blog.service";
import blogReducer from "./pages/Blog/blog.slice";

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer,
  },
  middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(blogApi.middleware, rtkQueryErrorLogger),
});

// setupListeners(store.dispatch);
// Lấy RootState và AppDispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
