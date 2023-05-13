import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { Post } from "src/types/post.type";
import { isUnprocessableEntityError } from "src/utils/helpers";
import { useAddPostsMutation, useUpdatePostMutation } from "../../blog.service";

type FormError =
  | {
      [key in keyof Post]: string;
    }
  | null;

const CreatePost = () => {
  const dispatch = useDispatch();
  const postId = useSelector((state: RootState) => state.blog.postId);
  const [formData, setFormData] = useState<Post>({
    id: "",
    title: "",
    featuredImage: "",
    publishDate: "",
    published: false,
    description: "",
  });
  const [addPost, addPostResult] = useAddPostsMutation();
  const [updatePost, updatePostResult] = useUpdatePostMutation();
  const errorForm: FormError = useMemo(() => {
    const errorResult = addPostResult.error;
    if (isUnprocessableEntityError(errorResult)) {
      return errorResult.data.error as FormError;
    }
    return null;
  }, [addPostResult.error]);
  const handleFormValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPost(formData).unwrap();
  };
  return (
    <div className="flex flex-col gap-x-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <input
            type="text"
            name="title"
            className="rounded-sm border-2 border-gray-400 text-sm font-medium outline-none focus:border-blue-500"
            placeholder="Tiêu đề"
            onChange={handleFormValue}
          />
        </div>
        <div className="mb-6">
          <input
            type="text"
            name="description"
            className="rounded-sm border-2 border-gray-400 text-sm font-medium outline-none focus:border-blue-500"
            placeholder="Mô tả"
            onChange={handleFormValue}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="publishDate"
            className={`mb-2 block text-sm font-medium text-gray-900  dark:text-gray-300`}
          >
            Publish Date
          </label>
          <input
            type="datetime-local"
            id="publishDate"
            className={`block w-56 rounded-lg border border-gray-300  bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
            value={formData.publishDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, publishDate: e.target.value }))}
          />
          <span className="text-red-500">{errorForm?.publishDate}</span>
        </div>
        <button className="rounded-sm bg-blue-500 px-2 py-3 text-sm font-medium text-white">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
