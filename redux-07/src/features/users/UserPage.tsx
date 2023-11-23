import { Link, useParams } from "react-router-dom";
import { selectUsersById } from "./usersSlice";
import { useSelector } from "react-redux";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";
import { RootState } from "../../app/store";

const UserPage = () => {
  const { userId } = useParams() as { userId: string };
  const user = useSelector((state: RootState) =>
    selectUsersById(state, userId),
  );

  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsByUserIdQuery(userId);

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    const { ids, entities } = postsForUser;
    content = ids.map((id: string) => {
      return (
        <li key={id}>
          <Link to={`/post/${id}`}>{entities[id].title}</Link>
        </li>
      );
    });
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{content}</ol>
    </section>
  );
};

export default UserPage;
