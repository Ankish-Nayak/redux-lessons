import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { PayloadAction } from "@reduxjs/toolkit";
import { sub } from "date-fns";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

export interface ReactionsI {
  thumbsUp: number;
  wow: number;
  heart: number;
  rocket: number;
  coffee: number;
}

export interface PostI {
  id: string;
  title: string;
  content: string;
  date: string;
  userId?: string;
  reactions: ReactionsI;
}
export interface PostsI {
  posts: PostI[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined | null;
}

const initialState: PostsI = {
  posts: [],
  status: "idle",
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<PostI>) {
        state.posts.push(action.payload);
      },
      prepare(
        title: string,
        content: string,
        userId: string,
        reactions: ReactionsI,
      ) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            userId,
            date: sub(new Date(), { minutes: 0 }).toISOString(),
            reactions,
          },
        };
      },
    },
    reactionAdded: (
      state: PostsI,
      action: PayloadAction<{
        postId: string;
        reaction: string;
      }>,
    ) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find(
        (post: PostI) => post.id === postId,
      );
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state: PostsI) => {
        state.status = "loading";
      })
      .addCase(
        fetchPosts.fulfilled,
        (
          state: PostsI,
          action: PayloadAction<
            {
              id: number;
              title: string;
              userId: number;
              body: string;
            }[]
          >,
        ) => {
          let min = 1;
          const loadedPosts = action.payload.map((post) => {
            const newPost: PostI = {
              id: post.id.toString(),
              userId: post.userId.toString(),
              title: post.title,
              content: post.body,
              date: sub(new Date(), { minutes: min++ }).toISOString(),
              reactions: {
                thumbsUp: 0,
                wow: 0,
                heart: 0,
                rocket: 0,
                coffee: 0,
              },
            };
            return newPost;
          });

          // adding those post only which dose not exists
          state.posts = [
            ...state.posts,
            ...loadedPosts.filter(
              (post1) => !state.posts.some((post2) => post1.id === post2.id),
            ),
          ];
          state.status = "succeeded";
        },
      )
      .addCase(fetchPosts.rejected, (state: PostsI, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(
        addNewPost.fulfilled,
        (
          state,
          action: PayloadAction<{
            id: number;
            userId: number;
            title: string;
            body: string;
          }>,
        ) => {
          const newPost: PostI = {
            id: action.payload.id.toString(),
            userId: action.payload.userId.toString(),
            title: action.payload.title,
            content: action.payload.body,
            date: new Date().toISOString(),
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          };
          state.posts.push(newPost);
        },
      );
  },
});

export const fetchPosts = createAsyncThunk("posts/fetchPost", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return [...response.data];
  } catch (e: any) {
    return e.message;
  }
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    try {
      const response = await axios.post(POSTS_URL, initialPost);
      return response.data;
    } catch (err) {
      console.log(err.message);
    }
  },
);

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsSatus = (state: RootState) => {
  return state.posts.status;
};
export const getPostsError = (state: RootState) => state.posts.error;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
