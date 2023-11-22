import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import { UserI } from "../users/usersSlice";

const PostAuthor = ({ userId }: { userId: string | undefined }) => {
  const users = useSelector(selectAllUsers);
  const author = users.find((user: UserI) => user.id === userId);
  const name = typeof author === "undefined" ? "undefined" : author.name;
  return <span>by {name}</span>;
};

export default PostAuthor;
