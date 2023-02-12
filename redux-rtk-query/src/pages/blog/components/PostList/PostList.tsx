import {
  useDeletePostMutation,
  useGetPostsQuery,
} from "pages/blog/blog.service";
import { startEditPost } from "pages/blog/blog.slice";
import { useDispatch } from "react-redux";
import PostItem from "../PostItem";
import SkeletonLoading from "../SkeletonLoading";

const PostList = () => {
  // isLoading chỉ dành cho lần fetch đầu tiên
  // isFetching là cho mỗi lần gọi API

  const { data, isFetching } = useGetPostsQuery();
  const [deletePost, deletePostResult] = useDeletePostMutation();
  const dispatch = useDispatch();
  const handleStartEdit = (postId: string) => {
    dispatch(startEditPost(postId));
  };
  const handleDeletePost = async (postId: string) => {
    await deletePost(postId);
  };
  return (
    <>
      <div className="py-6 bg-white sm:py-8 lg:py-12">
        <div className="max-w-screen-xl px-4 mx-auto md:px-8">
          <div className="mb-10 md:mb-16">
            <h2 className="mb-4 text-2xl font-bold text-center text-gray-800 md:mb-6 lg:text-3xl">
              Khôi Dev Blog
            </h2>
            <p className="max-w-screen-md mx-auto text-center text-gray-500 md:text-lg">
              Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ.
              Nhưng ngày mốt sẽ có nắng
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8">
            {isFetching && (
              <>
                <SkeletonLoading></SkeletonLoading>
                <SkeletonLoading></SkeletonLoading>
                <SkeletonLoading></SkeletonLoading>
                <SkeletonLoading></SkeletonLoading>
              </>
            )}
            {!isFetching &&
              data?.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  handleStartEdit={handleStartEdit}
                  handleDeletePost={handleDeletePost}
                ></PostItem>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostList;
