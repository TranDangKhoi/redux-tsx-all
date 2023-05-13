import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post } from "src/types/post.type";

export const blogApi = createApi({
  reducerPath: "blogApi",
  tagTypes: ["Posts"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000",
    timeout: 10000,
  }),
  endpoints: (build) => ({
    // Generic Types theo thứ tự là kiểu dữ liệu của response trả về và arguments
    getPosts: build.query<Post[], void>({
      query: () => "/posts",
      providesTags(results) {
        if (results) {
          const final = [
            ...results.map((result) => ({
              type: "Posts" as const,
              id: result.id,
            })),
            { type: "Posts" as const, id: "LIST" },
          ];
          return final;
        }
        return [{ type: "Posts" as const, id: "LIST" }];
      },
    }),
    addPosts: build.mutation<Post, Omit<Post, "id">>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, body) => (error ? [] : [{ type: "Posts", id: "LIST" }]),
    }),
    updatePost: build.mutation<Post, { id: string; body: Omit<Post, "id"> }>({
      query: (args) => ({
        url: `/posts/${args.id}`,
        method: "PUT",
        body: args.body,
      }),
      invalidatesTags: (result, error, body) => (error ? [] : [{ type: "Posts", id: "LIST" }]),
    }),
  }),
});

export const { useGetPostsQuery, useAddPostsMutation, useUpdatePostMutation } = blogApi;
