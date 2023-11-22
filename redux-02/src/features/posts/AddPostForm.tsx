import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postAdded } from "./postsSlice";
import { UserI, selectAllUsers } from "../users/usersSlice";

const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");

  const users = useSelector(selectAllUsers);

  const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { target } = e;
    if (target) {
      console.log(target.value);
      setUserId(target.value);
    }
  };

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(
        postAdded(title, content, userId, {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        }),
      );
      setTitle("");
      setContent("");
    }
  };
  const canSave = Boolean(title) && Boolean(content) && Boolean(userId);

  const usersOptions = users.map((user: UserI) => {
    return (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    );
  });

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select
          id="postAuthor"
          value={userId}
          onChange={(e) => onAuthorChanged(e)}
        >
          <option value={""}></option>
          {usersOptions}
        </select>
        <label htmlFor="postsContent">Post Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};
export default AddPostForm;
