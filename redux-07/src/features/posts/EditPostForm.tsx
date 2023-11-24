import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  selectPostById,
  PostI,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "./postsSlice";
import { RootState } from "../../app/store";
import { useState } from "react";
import { useGetUsersQuery } from "../users/usersSlice";

const EditPostForm = () => {
  const { postId } = useParams<{ postId: string }>() as { postId: string };
  const navigate = useNavigate();

  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const post = useSelector((state: RootState) =>
    selectPostById(state, postId.toString()),
  ) as PostI;

  // const users = useSelector((state: RootState) => selectAllUsers(state));

  const {
    data: users,
    isLoading: isLoadingUser,
    isError,
    isSuccess,
    error,
  } = useGetUsersQuery("getUsers");

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [userId, setUserId] = useState(post.userId);
  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);
  const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const canSave =
    [title, content, userId].every(Boolean) && !isLoading && !isLoadingUser;
  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        await updatePost({
          id: parseInt(post.id),
          title,
          body: content,
          userId: parseInt(post.userId as string),
          reactions: post.reactions,
        }).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        navigate(`/post/${postId}`);
      } catch (e) {
        console.log(e);
      }
    }
  };

  let usersOptions;
  if (isLoadingUser) {
    usersOptions = <p>Loading...</p>;
  } else if (isSuccess) {
    usersOptions = users.ids.map((id) => {
      return (
        <option key={id} value={id}>
          {users.entities[id]?.name}
        </option>
      );
    });
  } else if (isError) {
    usersOptions = <p>{JSON.stringify(error)}</p>;
  }

  const onDeletePostClicked = async () => {
    try {
      await deletePost({ id: post.id }).unwrap();

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
