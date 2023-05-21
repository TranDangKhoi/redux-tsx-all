import { Post } from "types/post.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Nếu bên slice chúng ta dùng createSlice để tạo slice thì bên RTK query dùng createApi
// Với createApi chúng ta gọi là slice api
// Chúng ta sẽ khai báo baseUrl và các endpoints

// baseQuery được dùng cho mỗi endpoint để fetch api

// fetchBaseQuery là một function nhỏ được xây dựng trên fetch API
// Nó không thay thế hoàn toàn được Axios nhưng sẽ giải quyết được hầu hết các vấn đề của bạn
// Chúng ta có thể dùng axios thay thế cũng được, nhưng để sau nhé

// endPoints là tập hợp những method giúp get, post, put, delete... tương tác với server
// Khi khai báo endPoints nó sẽ sinh ra cho chúng ta các hook tương ứng để dùng trong component
// endpoints có 2 kiểu là query và mutation.
// Query: Thường dùng cho GET
// Mutation: Thường dùng cho các trường hợp thay đổi dữ liệu trên server như POST, PUT, DELETE

// Có thể ban đầu mọi người thấy nó phức tạp và khó hiểu
// Không sao, mình cũng thể, các bạn chỉ cần hiểu là đây là cách setup mà RTK query yêu cầu
// Chúng ta chỉ cần làm theo hướng dẫn là được

export const blogApi = createApi({
  reducerPath: "blogApi", // Tên field trong Redux state
  tagTypes: ["Posts"], // Những kiểu tag cho phép dùng trong blogAPI
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000",
    timeout: 10000,
  }),
  endpoints: (build) => ({
    // Generic Types theo thứ tự là kiểu dữ liệu của response trả về và arguments
    getPosts: build.query<Post[], void>({
      query: () => "/posts", // method không có argument
      /**
       * provideTags có thể là array hoặc callback return array
       * Nếu có bất kì một invalidatesTags nào match với providesTags này
       * thì sẽ làm cho getPosts method chạy lại
       * và cập nhật lại danh sách các bài post cũng như các tags phía dưới
       */
      providesTags(result) {
        /**
         * Cái callback này sẽ chạy mỗi khi getPosts chạy
         * Mong muốn là sẽ return về một mảng kiểu
         * interface Tags: {
         *  type: "Posts"; // trùng với tên tagTypes ở trên
         *  id: string;
         * }
         * Vì thế phải thêm as count vào để báo hiệu type là read-only, không thể mutate
         */
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: "Posts" as const, id })),
            { type: "Posts" as const, id: "LIST" },
          ];
          return final;
        }
        return [{ type: "Posts" as const, id: "LIST" }];
      },
    }),
    addPosts: build.mutation<Post, Omit<Post, "id">>({
      query: (body) => {
        // thêm đoạn code lỗi để test serialized error toast
        // let a: any = null;
        // a.b = 1;
        return {
          url: "/posts",
          method: "POST",
          body,
        };
      },
      /**
       * invalidatesTags cung cấp các tag để báo hiệu cho những method nào có providesTags
       * match với nó sẽ bị gọi lại
       * Trong trường hợp này getPosts sẽ được chạy lại sau khi addPost thành công
       */
      invalidatesTags: (result, error, body) =>
        error ? [] : [{ type: "Posts", id: "LIST" }],
    }),
    getSinglePost: build.query<Post, string>({
      query: (postId) => `/posts/${postId}`,
    }),
    updatePost: build.mutation<Post, { id: string; body: Post }>({
      query: (args) => {
        return {
          url: `/posts/${args.id}`,
          method: "PUT",
          body: args.body,
        };
      },
      // Trong trường hợp này thì getPosts sẽ chạy lại
      invalidatesTags: (result, error, data) =>
        error ? [] : [{ type: "Posts", id: data.id }],
    }),
    deletePost: build.mutation<{}, string>({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, data) => [
        {
          type: "Posts",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useAddPostsMutation,
  useGetSinglePostQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
} = blogApi;
