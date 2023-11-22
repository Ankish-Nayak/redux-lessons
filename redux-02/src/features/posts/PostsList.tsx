import { useSelector } from "react-redux";
import { PostI, selectAllPosts } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
const PostsList = () => {
  const posts = useSelector(selectAllPosts);

  // ordering post by time so that most recent one comes up
  const orderedPosts = posts
    .slice()
    .sort((a: PostI, b: PostI) => b.date.localeCompare(a.date));

  const renderedPosts = orderedPosts.map((post: PostI) => {
    return (
      <article key={post.id}>
        <h3>{post.title}</h3>
        <p>{post.content.substring(0, 100)}</p>
        <p className="postCredict">
          <PostAuthor userId={post.userId} />
          <TimeAgo timeStamp={post.date} />
        </p>
        <ReactionButtons post={post} />
      </article>
    );
  });
  return (
    <section>
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  );
};
export default PostsList;
