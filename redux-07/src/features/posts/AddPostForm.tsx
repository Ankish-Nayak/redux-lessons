import { useState } from "react";
import { useGetUsersQuery } from "../users/usersSlice";
import { useAddNewPostMutation } from "./postsSlice";
import { useNavigate } from "react-router-dom";

const AddPostForm = () => {
  const [addNewPost, { isLoading }] = useAddNewPostMutation();

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const {
    data: users,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    isSuccess: isSuccessUser,
    error: errorUser,
  } = useGetUsersQuery("getUsers");
  const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { target } = e;
    if (target) {
      console.log(target.value);
      setUserId(target.value);
    }
  };

  const canSave =
    [title, content, userId].every(Boolean) && !isLoading && !isLoadingUser;
  const onSavePostClicked = async () => {
    try {
      await addNewPost({
        title,
        body: content,
        userId: parseInt(userId as string),
      }).unwrap();

      setTitle("");
      setContent("");
      setUserId("");

      navigate("/");
    } catch (e) {
      console.log("Failed to save the post", e);
    }
  };

  let usersOptions;
  if (isLoadingUser) {
    usersOptions = <p>Loading...</p>;
  } else if (isSuccessUser) {
    usersOptions = users.ids.map((id) => {
      return (
        <option key={id} value={id}>
          {users.entities[id]?.name}
        </option>
      );
    });
  } else if (isErrorUser) {
    usersOptions = <p>{JSON.stringify(errorUser)}</p>;
  }

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
