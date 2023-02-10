import {
  deletePost,
  getPostList,
  startEditingPost,
} from "pages/blog/blog.slice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "store";
import PostItem from "../PostItem";
import SkeletonLoading from "../SkeletonLoading";
//1. Gọi API trong useEffect()
//2. Nếu gọi thành công => dispatch action type: "blog/getPostListSuccess"
//3. Nếu gọi thất bại => dipsatch action type: "blog/getPostListFailed"

const PostList = () => {
  const postList = useSelector((state: RootState) => state.blog.postList);
  const loading = useSelector((state: RootState) => state.blog.loading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getPostList());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const handleRemovePost = (postId: string) => {
    dispatch(deletePost(postId));
  };

  const handleStartEditing = (postId: string) => {
    dispatch(startEditingPost(postId));
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
            {!loading &&
              postList.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  handleRemovePost={handleRemovePost}
                  handleStartEditing={handleStartEditing}
                ></PostItem>
              ))}
            {loading && (
              <>
                <SkeletonLoading></SkeletonLoading>
                <SkeletonLoading></SkeletonLoading>
                <SkeletonLoading></SkeletonLoading>
                <SkeletonLoading></SkeletonLoading>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostList;
