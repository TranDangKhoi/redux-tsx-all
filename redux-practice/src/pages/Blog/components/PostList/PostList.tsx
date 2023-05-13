import { useGetPostsQuery } from "../../blog.service";

type TPostListProps = {
  something: string;
};

const PostList = () => {
  const { data: postsData } = useGetPostsQuery();
  const posts = postsData;
  return (
    <div className="w-full max-w-2xl">
      {posts &&
        posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center gap-x-2"
          >
            <div
              className="font-medium"
              key={post.id}
            >
              {post.title}
            </div>
            <span className="cursor-pointer text-blue-500">Edit post</span>
          </div>
        ))}
    </div>
  );
};

export default PostList;
