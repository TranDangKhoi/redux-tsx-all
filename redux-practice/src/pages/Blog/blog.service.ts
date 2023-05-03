import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
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
        url: "/query",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {} = blogApi;
