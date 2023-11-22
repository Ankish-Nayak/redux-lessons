import { useDispatch, useSelector } from "react-redux";
import {
  PostI,
  fetchPosts,
  getPostsError,
  getPostsSatus,
  selectAllPosts,
} from "./postsSlice";
import { useEffect } from "react";
import PostsExcerpt from "./PostsExcerpt";
import { AppDispatch } from "../../app/store";
const PostsList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const posts = useSelector(selectAllPosts);
  const postStatus = useSelector(getPostsSatus);
  const error = useSelector(getPostsError);

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);
  // ordering post by time so that most recent one comes up

  let content;
  if (postStatus === "loading") {
    content = <p>"loading..."</p>;
  } else if (postStatus === "succeeded") {
    const orderedPosts = posts
      .slice()
      .sort((a: PostI, b: PostI) => b.date.localeCompare(a.date));
    content = orderedPosts.map((post: PostI) => {
      return <PostsExcerpt post={post} />;
    });
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
