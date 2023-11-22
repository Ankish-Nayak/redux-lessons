import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserI, selectAllUsers } from "../users/usersSlice";
import { addNewPost, postAdded } from "./postsSlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/store";

const AddPostForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const users = useSelector(selectAllUsers);

  const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { target } = e;
    if (target) {
      console.log(target.value);
      setUserId(target.value);
    }
  };

  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === "idle";
  const onSavePostClicked = () => {
    try {
      setAddRequestStatus("pending");
      dispatch(addNewPost({ title, body: content, userId })).unwrap();

      setTitle("");
      setContent("");
      setUserId("");

      navigate("/");
    } catch (e) {
      console.log("Failed to save the post", e);
    } finally {
      setAddRequestStatus("idle");
    }
  };

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
