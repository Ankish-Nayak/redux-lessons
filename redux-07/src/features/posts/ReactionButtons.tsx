import { PostI, ReactionI, useAddReactionMutation } from "./postsSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionButtons = ({ post }: { post: PostI }) => {
  const [addReaction] = useAddReactionMutation();

  const reactionButtons = Object.entries(reactionEmoji).map(
    ([name, emoji]: [name: string, emoji: string]) => {
      return (
        <button
          key={name}
          type="button"
          className={"reactionButton"}
          onClick={() => {
            console.log(post);
            const newValue = post.reactions[name as ReactionI] + 1;
            addReaction({
              postId: post.id,
              reactions: { ...post.reactions, [name]: newValue },
            });
          }}
        >
          {emoji} {post.reactions[name as ReactionI]}
        </button>
      );
    },
  );
  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
