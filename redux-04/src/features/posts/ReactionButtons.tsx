import { useDispatch } from "react-redux";
import { PostI, reactionAdded } from "./postsSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionButtons = ({ post }: { post: PostI }) => {
  const dispatch = useDispatch();

  const reactionButtons = Object.entries(reactionEmoji).map(
    ([name, emoji]: [name: string, emoji: string]) => {
      return (
        <button
          key={name}
          type="button"
          className={"reactionButton"}
          onClick={() => {
            console.log(post);
            dispatch(reactionAdded({ postId: post.id, reaction: name }));
          }}
        >
          {emoji} {post.reactions[name]}
        </button>
      );
    },
  );
  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
