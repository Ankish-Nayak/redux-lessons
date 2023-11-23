import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { RootState } from "../../app/store";
import { useParams, Link } from "react-router-dom";

const SinglePostPage = () => {
  const { postId } = useParams() as { postId: string };
  console.log("rendered");

  const post = useSelector((state: RootState) =>
    selectPostById(state, postId.toString()),
  );
  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <article>
      <h3>{post.title}</h3>
      <p>{post.content.substring(0, 100)}</p>
      <p className="postCredict">
        <Link to={`/post/edit/${post.id}`}>Edit Post </Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timeStamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  );
};

export default SinglePostPage;
