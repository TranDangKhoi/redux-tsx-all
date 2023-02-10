import http from "utils/http";
import { Post } from "../../types/post.type";
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  AsyncThunk,
} from "@reduxjs/toolkit";

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
type FulFilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;

interface BlogState {
  postList: Post[];
  editingPost: Post | null;
  loading: boolean;
  currentRequestId: undefined | string;
}

const initialState: BlogState = {
  postList: [],
  editingPost: null,
  loading: false,
  currentRequestId: undefined,
};

export const getPostList = createAsyncThunk(
  "blog/getPostList",
  async (_, thunkAPI) => {
    const response = await http.get<Post[]>("/posts", {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

export const addPost = createAsyncThunk(
  "blog/addPost",
  async (body: Omit<Post, "id">, thunkAPI) => {
    const response = await http.post<Post>("/posts", body, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  "blog/updatePost",
  async (body: Post, thunkAPI) => {
    const response = await http.put<Post>(`/posts/${body.id}`, body, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  "blog/deletePost",
  async (postId: string, thunkAPI) => {
    const response = await http.delete(`posts/${postId}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
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
  },
  extraReducers(builder) {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postList.find((post, index) => {
          if (post.id === action.payload.id) {
            state.postList[index] = action.payload;
            return true;
          }
          return false;
        });
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        const newPostList = state.postList.filter((post) => post.id !== postId);
        state.postList = newPostList;
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith("/pending"),
        (state, action) => {
          state.loading = true;
          state.currentRequestId = action.meta.requestId;
        }
      )
      .addMatcher<RejectedAction | FulFilledAction>(
        (action) =>
          action.type.endsWith("/rejected") ||
          action.type.endsWith("/fulfilled"),
        (state, action) => {
          if (
            state.loading &&
            state.currentRequestId === action.meta.requestId
          ) {
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      );
  },
});

export const { cancelEditingPost, finishEditingPost, startEditingPost } =
  blogSlice.actions;

const blogReducer = blogSlice.reducer;
export default blogReducer;
