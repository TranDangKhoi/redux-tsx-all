import { useGetPostsQuery } from "../../blog.service";

type TPostListProps = {
  something: string;
};

const PostList = () => {
  const { data: postsData } = useGetPostsQuery();
  const posts = postsData;
  return (
    <div className="max-w-xl w-full">
      {posts &&
        posts.map((post) => (
          <div
            className="font-medium"
            key={post.id}
          >
            {post.title}
          </div>
        ))}
    </div>
  );
};

export default PostList;
