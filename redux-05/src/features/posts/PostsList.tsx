import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  getPostsError,
  getPostsSatus,
  selectPostIds,
} from "./postsSlice";
import { useEffect } from "react";
import PostsExcerpt from "./PostsExcerpt";
import { AppDispatch } from "../../app/store";
const PostsList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const orderedPosts = useSelector(selectPostIds);
  const postStatus = useSelector(getPostsSatus);
  const error = useSelector(getPostsError);

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  let content;
  if (postStatus === "loading") {
    content = <p>"loading..."</p>;
  } else if (postStatus === "succeeded") {
    content = orderedPosts.map((id) => (
      <PostsExcerpt key={id} postId={id as string} />
    ));
  } else if (postStatus === "failed") {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
};
export default PostsList;
