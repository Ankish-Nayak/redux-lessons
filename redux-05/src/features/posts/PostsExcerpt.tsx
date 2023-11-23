import { memo } from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";
import ReactionButtons from "./ReactionButtons";
import TimeAgo from "./TimeAgo";
import { selectPostById } from "./postsSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

let PostsExcerpt = ({ postId }: { postId: string }) => {
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  if (!post) {
    return <>Post dose not exists!</>;
  }
  return (
    <article>
      <h3>{post.title}</h3>
      <p>{post.content.substring(0, 75)}...</p>
      <p className="postCredict">
        <Link to={`post/${post.id}`}>View Post </Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timeStamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  );
};

PostsExcerpt = memo(PostsExcerpt) as typeof PostsExcerpt;

export default PostsExcerpt;
