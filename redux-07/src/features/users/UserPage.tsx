import { Link, useParams } from "react-router-dom";
import { useGetUsersQuery } from "./usersSlice";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";

const UserPage = () => {
  const { userId } = useParams() as { userId: string };

  const {
    user,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
    isError: isErrorUser,
    error: errorUser,
  } = useGetUsersQuery("getUsers", {
    selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
      user: data?.entities[userId],
      isLoading,
      isSuccess,
      isError,
      error,
    }),
  });

  // const user = useSelector((state: RootState) =>
  //   selectUsersById(state, userId),
  // );

  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsByUserIdQuery(userId);

  let content;
  if (isLoading || isLoadingUser) {
    content = <p>Loading...</p>;
  } else if (isSuccess && isSuccessUser) {
    const { ids, entities } = postsForUser;
    content = ids.map((id) => {
      return (
        <li key={id}>
          <Link to={`/post/${id}`}>{entities[id]?.title}</Link>
        </li>
      );
    });
  } else if (isError || isErrorUser) {
    content = (
      <p>
        {JSON.stringify(error)} {JSON.stringify(errorUser)}
      </p>
    );
  }

  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{content}</ol>
    </section>
  );
};

export default UserPage;
