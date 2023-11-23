import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import { UserI } from "../users/usersSlice";
import { Link } from "react-router-dom";

const PostAuthor = ({ userId }: { userId: string | undefined }) => {
  const users = useSelector(selectAllUsers);
  const author = users.find((user: UserI) => user.id === userId);
  if (typeof author === "undefined") {
    return <span>"by Unknown author"</span>;
  }
  return <span>by {<Link to={`/user/${userId}`}>{author.name}</Link>}</span>;
};

export default PostAuthor;
