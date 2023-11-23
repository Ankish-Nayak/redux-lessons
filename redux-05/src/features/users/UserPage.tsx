import { Link, useParams } from "react-router-dom";
import { selectUsersById } from "./usersSlice";
import { useSelector } from "react-redux";
import { selectPostsByUser } from "../posts/postsSlice";
import { RootState } from "../../app/store";

const UserPage = () => {
  const { userId } = useParams() as { userId: string };
  const user = useSelector((state: RootState) =>
    selectUsersById(state, userId),
  );

  // optimized way
  const postsForUser = useSelector((state: RootState) =>
    selectPostsByUser(state, userId),
  );
  // const postsForUser = useSelector((state: RootState) => {
  //   const allPosts = selectAllPosts(state);
  //   return allPosts.filter((post) => post.userId === userId);
  // });

  const postTitles = postsForUser.map((post) => {
    return (
      <li key={post.id}>
        <Link to={`/post/${post.id}`}>{post.title}</Link>
      </li>
    );
  });
  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{postTitles}</ol>
    </section>
  );
};

export default UserPage;
