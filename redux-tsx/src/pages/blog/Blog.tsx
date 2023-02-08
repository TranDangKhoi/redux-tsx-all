import React from "react";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";

const Blog = () => {
  return (
    <div className="p-5">
      <CreatePost></CreatePost>
      <PostList></PostList>
    </div>
  );
};

export default Blog;
