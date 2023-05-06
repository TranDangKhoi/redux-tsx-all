import React, { useEffect, useState } from "react";
import { Post } from "src/types/post.type";
import { useAddPostsMutation } from "../../blog.service";

type TCreatePostProps = {
  something: string;
};

const CreatePost = () => {
  const [formData, setFormData] = useState<Post>({
    id: "",
    title: "",
    featuredImage: "",
    publishDate: "",
    published: false,
    description: "",
  });
  const [addPost, addPostResult] = useAddPostsMutation();
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
        <div>
          <input
            type="text"
            name="title"
            className="border-2 rounded-sm border-gray-400 focus:border-blue-500 outline-none text-sm font-medium"
            placeholder="Tiêu đề"
            onChange={handleFormValue}
          />
        </div>
        <div>
          <input
            type="text"
            name="description"
            className="border-2 rounded-sm border-gray-400 focus:border-blue-500 outline-none text-sm font-medium"
            placeholder="Mô tả"
            onChange={handleFormValue}
          />
        </div>
        <button className="bg-blue-500 text-white rounded-sm py-3 px-2 text-sm font-medium">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
