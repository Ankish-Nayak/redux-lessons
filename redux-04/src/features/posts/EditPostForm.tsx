import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectPostById, updatePost, PostI, deletePost } from "./postsSlice";
import { RootState, AppDispatch } from "../../app/store";
import { useState } from "react";
import { selectAllUsers } from "../users/usersSlice";

const EditPostForm = () => {
  const { postId } = useParams<{ postId: string }>() as { postId: string };
  const navigate = useNavigate();

  const post = useSelector((state: RootState) =>
    selectPostById(state, postId.toString()),
  ) as PostI;

  const users = useSelector((state: RootState) => selectAllUsers(state));

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [userId, setUserId] = useState(post.userId);
  const [requestStatus, setRequestStatus] = useState("idle");
  const dispatch = useDispatch<AppDispatch>();
  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const canSave =
    [title, content, userId].every(Boolean) && requestStatus === "idle";
  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);
  const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setRequestStatus("pending");
        dispatch(
          updatePost({
            id: Number(post.id),
            title,
            body: content,
            userId: Number(userId),
            reactions: post.reactions,
          }),
        ).unwrap();
        setTitle("");
        setContent("");
        setUserId("");
        navigate(`/post/${postId}`);
      } catch (e) {
        console.log(e);
      } finally {
        setRequestStatus("idle");
      }
    }
  };

  const usersOptions = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    );
  });

  const onDeletePostClicked = () => {
    try {
      setRequestStatus("pending");
      dispatch(deletePost({ id: post.id })).unwrap();

      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (e) {
      if (typeof e === "string") {
        console.log(e);
      } else if (e instanceof Error) {
        console.log(e.message);
      }
    } finally {
      setRequestStatus("idle");
    }
  };
  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Post Author:</label>
        <select
          id="postAuthor"
          defaultValue={userId}
          onChange={onAuthorChanged}
        >
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
        <button
          type="button"
          className="deleteButton"
          onClick={onDeletePostClicked}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditPostForm;
