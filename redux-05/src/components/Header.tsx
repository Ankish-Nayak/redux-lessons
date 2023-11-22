import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCount, increaseCount } from "../features/posts/postsSlice";
import { AppDispatch, RootState } from "../app/store";
const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const count = useSelector((state: RootState) => getCount(state));
  return (
    <header className="Header">
      <h1>Redux Blog</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="post">Post</Link>
          </li>
          <li>
            <Link to="user">User</Link>
          </li>
        </ul>
        <button type="button" onClick={() => dispatch(increaseCount())}>
          {count}
        </button>
      </nav>
    </header>
  );
};

export default Header;
