import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { TPost } from "src/types/post.type";
import { blogApi, useAddPostsMutation, useGetSinglePostQuery, useUpdatePostsMutation } from "../../blog.api";
import { finishedEditMode } from "../../blog.slice";
const initialFormState: Omit<TPost, "id"> = {
  title: "",
  description: "",
  featuredImage: "",
  publishDate: "",
  published: false,
};

const CreatePost = () => {
  const dispatch = useDispatch();
  const beingUpdatedPostId = useSelector((state: RootState) => state.blog.postId);
  const [formState, setFormState] = useState<Omit<TPost, "id">>(initialFormState);
  const [addPost, addPostResult] = useAddPostsMutation();
  const [updatePost, updatePostResult] = useUpdatePostsMutation();
  const { data: singlePostData } = useGetSinglePostQuery(beingUpdatedPostId, { skip: !beingUpdatedPostId });
  // const formError = useMemo(() => {
  //   const error =
  // }, []);
  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (beingUpdatedPostId) {
      await updatePost({
        id: beingUpdatedPostId,
        body: formState,
      }).unwrap();
      dispatch(finishedEditMode());
    } else {
      await addPost(formState).unwrap();
    }
    setFormState(initialFormState);
  };

  useEffect(() => {
    if (singlePostData) {
      setFormState(singlePostData);
    }
  }, [singlePostData]);
  return (
    <div>
      <form
        className="flex flex-col gap-x-5"
        onSubmit={handleSubmit}
      >
        <label htmlFor="Title">Title:</label>
        <input
          type="text"
          name="title"
          className="rounded-sm border-2 border-gray-300 text-lg outline-none"
          value={formState.title}
          onChange={handleChangeValue}
        />
        <label htmlFor="Description">Description:</label>
        <input
          type="text"
          name="description"
          className="rounded-sm border-2 border-gray-300 text-lg outline-none"
          value={formState.description}
          onChange={handleChangeValue}
        />
        <label
          htmlFor="publishDate"
          className={`mb-2 block text-sm font-medium text-gray-900  dark:text-gray-300`}
        >
          Publish Date
        </label>
        <input
          type="datetime-local"
          name="publishDate"
          className={`block rounded-lg border border-gray-300  bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
          value={formState.publishDate}
          onChange={handleChangeValue}
        />
        <button
          type="submit"
          className="mt-2 rounded-sm bg-blue-500 px-3 py-2 text-lg text-white"
        >
          {beingUpdatedPostId ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
