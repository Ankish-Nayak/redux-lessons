import { PostI } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link } from "react-router-dom";

const PostsExcerpt = ({ post }: { post: PostI }) => {
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

export default PostsExcerpt;
