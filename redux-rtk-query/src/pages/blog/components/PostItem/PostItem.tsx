import React from "react";
import { Post } from "types/post.type";
interface PostItemProps {
  post: Post;
  handleStartEdit: (postId: string) => void;
  handleDeletePost: (postId: string) => void;
}
const PostItem = (props: PostItemProps) => {
  const { post, handleStartEdit, handleDeletePost } = props;
  return (
    <div className="flex flex-col items-center overflow-hidden border rounded-lg md:flex-row">
      <div className="relative self-start block w-full h-48 overflow-hidden bg-gray-100 group shrink-0 md:h-full md:w-32 lg:w-48">
        <img
          src={post.featuredImage}
          loading="lazy"
          alt={post.title}
          className="absolute inset-0 object-cover object-center w-full h-full transition duration-200 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-col gap-2 p-4 lg:p-6">
        <span className="text-sm text-gray-400">{post.publishDate}</span>
        <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
        <p className="text-gray-500">{post.description}</p>
        <div>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
              onClick={() => handleStartEdit(post.id)}
            >
              Edit
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-r border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
              onClick={() => handleDeletePost(post.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
