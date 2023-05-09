import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import {
  useAddPostsMutation,
  useGetSinglePostQuery,
  useUpdatePostMutation,
} from "pages/blog/blog.service";
import { cancelEditPost } from "pages/blog/blog.slice";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { Post } from "types/post.type";
import {
  isFetchBaseQueryError,
  isSerializedError,
  isUnprocessableEntityError,
} from "utils/helpers";

const formDataInitialState: Omit<Post, "id"> = {
  title: "",
  description: "",
  featuredImage: "",
  publishDate: "",
  published: false,
};

type FormError =
  | {
      [key in keyof typeof formDataInitialState]: string;
    }
  | null;

const CreatePost = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Omit<Post, "id"> | Post>(
    formDataInitialState
  );
  const postId = useSelector((state: RootState) => state.blog.postId);
  const [addPost, addPostResult] = useAddPostsMutation();
  const { data } = useGetSinglePostQuery(postId, { skip: !postId });
  const [updatePost, updatePostResult] = useUpdatePostMutation();
  // Không cần lưu errors vào state, lưu vào một biến rồi dùng useMemo là được rồi
  // Nếu lưu vào state thì dùng try catch ở hàm submit rồi xử lí narrow-type như thường
  const errorForm: FormError = useMemo(() => {
    // Vì ta truyền postId vào trong store khi đang ở trong trạng thái update post, nên nếu có postId thì
    // đồng nghĩa với việc errorForm phải là lỗi của updatePostResult và ngược lại nếu không có postId
    // thì là người dùng đang add post
    const errorResult = postId ? updatePostResult.error : addPostResult.error;
    // Vì errorResult của chúng ta có thể là FetchBaseQueryError | SerializedError | undefined, mỗi kiểu lại có một cấu trúc khác nhau
    // Nên ta cần kiểm tra để hiển thị cho đúng
    if (isUnprocessableEntityError(errorResult)) {
      return errorResult.data.error as FormError;
    }
    return null;
  }, [addPostResult.error, postId, updatePostResult.error]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (postId) {
        await updatePost({
          id: postId,
          body: formData as Post,
        }).unwrap();
        dispatch(cancelEditPost());
      } else {
        await addPost(formData).unwrap();
      }
      setFormData(formDataInitialState);
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="featuredImage"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Featured Image
        </label>
        <input
          type="text"
          id="featuredImage"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="Url image"
          value={formData.featuredImage}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))
          }
        />
      </div>
      <div className="mb-6">
        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Your description..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="publishDate"
          className={`text-gray-900 block mb-2 text-sm font-medium  dark:text-gray-300`}
        >
          Publish Date
        </label>
        <input
          type="datetime-local"
          id="publishDate"
          className={`block w-56 rounded-lg border border-gray-300  bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
          value={formData.publishDate}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, publishDate: e.target.value }))
          }
        />
        <span className="text-red-500">{errorForm?.publishDate}</span>
      </div>

      <div className="flex items-center mb-6">
        <input
          id="publish"
          type="checkbox"
          className="w-4 h-4 focus:ring-2 focus:ring-blue-500"
          checked={formData.published}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, published: e.target.checked }))
          }
        />
        <label
          htmlFor="publish"
          className="ml-2 text-sm font-medium text-gray-900"
        >
          Publish
        </label>
      </div>
      <div>
        {postId && (
          <>
            <button
              type="submit"
              className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800"
            >
              <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                Update Post
              </span>
            </button>
            <button
              type="reset"
              className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400"
            >
              <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
                Cancel
              </span>
            </button>
          </>
        )}
        {!postId && (
          <button
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800"
            type="submit"
          >
            <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
              Publish Post
            </span>
          </button>
        )}
      </div>
    </form>
  );
};

export default CreatePost;
