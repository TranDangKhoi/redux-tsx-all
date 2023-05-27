import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { rtkQueryErrorsLogger } from "./middleware";
import { blogApi } from "./pages/Blog/blog.api";
import blogReducer from "./pages/Blog/blog.slice";

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer,
  },
  middleware: (gdm) => gdm().concat(blogApi.middleware, rtkQueryErrorsLogger),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
