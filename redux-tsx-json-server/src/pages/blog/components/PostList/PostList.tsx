import { AxiosError } from "axios";
import { removePost, startEditingPost } from "pages/blog/blog.slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import http from "utils/http";
import PostItem from "../PostItem";
//1. Gọi API trong useEffect()
//2. Nếu gọi thành công => dispatch action type: "blog/getPostListSuccess"
//3. Nếu gọi thất bại => dipsatch action type: "blog/getPostListFailed"

const PostList = () => {
  const postList = useSelector((state: RootState) => state.blog.postList);
  const dispatch = useDispatch();
  useEffect(() => {
    const controller = new AbortController();
    (async function getPostList() {
      try {
        const res = await http.get("/posts", {
          signal: controller.signal,
        });
        const postListResult = res.data;
        dispatch({
          type: "blog/getPostListSuccessful",
          payload: postListResult,
        });
      } catch (err: any) {
        if (!(err.code === "ERR_CANCELED")) {
          dispatch({
            type: "blog/getPostListFailed",
            payload: err,
          });
        }
        return err;
      }
    })();
    return () => {
      controller.abort();
    };
  }, [dispatch]);
  const handleRemovePost = (postId: string) => {
    dispatch(removePost(postId));
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
            {postList.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                handleRemovePost={handleRemovePost}
                handleStartEditing={handleStartEditing}
              ></PostItem>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostList;
