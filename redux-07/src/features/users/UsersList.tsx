import { useGetUsersQuery } from "./usersSlice";
import { Link } from "react-router-dom";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("getUsers");

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    const renderedUsers = users.ids.map((id) => (
      <li key={id}>
        <Link to={`/users/${users.entities[id]?.id}`}>
          {users.entities[id]?.name}
        </Link>
      </li>
    ));
    content = (
      <section>
        <h2>Users</h2>
        <ul>{renderedUsers}</ul>
      </section>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  //const users = useSelector(selectAllUsers);
  console.log(users);

  return content;
};
export default UsersList;
