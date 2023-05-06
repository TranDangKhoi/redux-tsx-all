import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";

type TBlogProps = {
  something: string;
};

const Blog = () => {
  return (
    <>
      <CreatePost></CreatePost>
      <PostList></PostList>
    </>
  );
};

export default Blog;
