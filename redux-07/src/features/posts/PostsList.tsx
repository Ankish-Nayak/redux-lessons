import { useSelector } from "react-redux";
import { selectPostIds } from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";
import { useGetPostsQuery } from "./postsSlice";
const PostsList = () => {
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();

  const orderedPosts = useSelector(selectPostIds);

  let content;
  if (isLoading) {
    content = <p>"loading..."</p>;
  } else if (isSuccess) {
    content = orderedPosts.map((id) => (
      <PostsExcerpt key={id} postId={id as string} />
    ));
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
};
export default PostsList;
