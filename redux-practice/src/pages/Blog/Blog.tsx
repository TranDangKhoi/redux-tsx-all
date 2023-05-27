import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";

type TBlogProps = {
  something: string;
};

const Blog = () => {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <CreatePost></CreatePost>
      <PostList></PostList>
    </div>
  );
};

export default Blog;
