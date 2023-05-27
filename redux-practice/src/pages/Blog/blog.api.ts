import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TPost } from "src/types/post.type";
export const blogApi = createApi({
  reducerPath: "blogApi",
  tagTypes: ["Posts"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000",
    timeout: 10000,
  }),
  endpoints: (build) => ({
    getPosts: build.query<TPost[], void>({
      query: () => ({
        url: "/posts",
      }),
      providesTags(results) {
        if (results) {
          const final = [
            ...results.map(({ id }) => ({ type: "Posts" as const, id })),
            { type: "Posts" as const, id: "LIST" },
          ];
          return final;
        }
        return [{ type: "Posts" as const, id: "LIST" }];
      },
    }),
    getSinglePost: build.query<TPost, string>({
      query: (postId) => `/posts/${postId}`,
    }),
    addPosts: build.mutation<TPost, Omit<TPost, "id">>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, body) => (error ? [] : [{ type: "Posts", id: "LIST" }]),
    }),
    updatePosts: build.mutation<TPost, { id: string; body: Omit<TPost, "id"> }>({
      query: (args) => {
        const { id, body } = args;
        return {
          url: `/posts/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (result, error, data) => (error ? [] : [{ type: "Posts", id: data.id }]),
    }),
    deletePosts: build.mutation<TPost, string>({
      query: (postId) => {
        return {
          url: `/posts/${postId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, body) => (error ? [] : [{ type: "Posts", id: "LIST" }]),
    }),
  }),
});

export const {
  useGetPostsQuery,
  useAddPostsMutation,
  useGetSinglePostQuery,
  useUpdatePostsMutation,
  useDeletePostsMutation,
} = blogApi;
