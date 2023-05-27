import { useDispatch } from "react-redux";
import { useDeletePostsMutation, useGetPostsQuery } from "../../blog.api";
import { startEditMode } from "../../blog.slice";

const PostList = () => {
  const dispatch = useDispatch();
  const { data: postListData } = useGetPostsQuery();
  const [deletePost] = useDeletePostsMutation();
  const handleStartEdittingPost = (id: string) => {
    dispatch(startEditMode(id));
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="mt-5 flex flex-col gap-y-2">
        {postListData &&
          postListData.map((post) => (
            <div
              className="flex gap-x-2"
              key={post.id}
            >
              <span className="text-lg">{post.title}</span>
              <button
                type="button"
                className="rounded-sm bg-blue-500 p-1 text-sm text-white"
                onClick={() => handleStartEdittingPost(post.id)}
              >
                Update
              </button>
              <button
                type="button"
                className="rounded-sm bg-blue-500 p-1 text-sm text-white"
                onClick={() => {
                  deletePost(post.id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PostList;
