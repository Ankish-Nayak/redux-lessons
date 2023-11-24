import { useGetUsersQuery } from "../users/usersSlice";
import { Link } from "react-router-dom";

const PostAuthor = ({ userId }: { userId: string | undefined }) => {
  const { user: author, isLoading } = useGetUsersQuery("getUsers", {
    selectFromResult: ({ data, isLoading }) => ({
      user: data?.entities[userId as string],
      isLoading,
    }),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <span>
      by{" "}
      {author ? (
        <Link to={`/user/${userId}`}>{author.name}</Link>
      ) : (
        "Unknown author"
      )}
    </span>
  );
};

export default PostAuthor;
