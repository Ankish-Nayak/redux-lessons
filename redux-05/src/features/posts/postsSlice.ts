import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
  nanoid,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";
import { RootState } from "../../app/store";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

export interface ReactionsI {
  thumbsUp: number;
  wow: number;
  heart: number;
  rocket: number;
  coffee: number;
}
export type ReactionI = "thumbsUp" | "wow" | "heart" | "rocket" | "coffee";

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
  count: number;
}

const postsAdapter = createEntityAdapter<PostI>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});
const initialState = postsAdapter.getInitialState<PostsI>({
  posts: [],
  status: "idle",
  error: null,
  count: 0,
});
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
      state,
      action: PayloadAction<{
        postId: string;
        reaction: ReactionI;
      }>,
    ) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    increaseCount(state) {
      state.count = state.count + 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchPosts.fulfilled,
        (
          state,
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

          postsAdapter.upsertMany(state, loadedPosts);

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
          postsAdapter.addOne(state, newPost);
        },
      )
      .addCase(
        updatePost.fulfilled,
        (
          state,
          action: PayloadAction<{
            id: number;
            title: string;
            body: string;
            userId: number;
            reactions: ReactionsI;
          }>,
        ) => {
          if (!action.payload.id) {
            console.log("Update could not complete");
            console.log(action.payload);
            return;
          }
          const newPost: PostI = {
            id: action.payload.id.toString(),
            userId: action.payload.userId.toString(),
            title: action.payload.title,
            content: action.payload.body,
            date: new Date().toISOString(),
            reactions: action.payload.reactions,
          };
          postsAdapter.upsertOne(state, newPost);
        },
      )
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        postsAdapter.removeOne(state, id);
      });
  },
});

export const fetchPosts = createAsyncThunk(
  "posts/fetchPost",
  async (_, { rejectWithValue }) => {
    // const response = await axios.get(POSTS_URL);
    // return [...response.data] ;
    try {
      const response = await axios.get(POSTS_URL);
      return [...response.data];
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (
    initialPost: {
      id: number;
      userId: number;
      title: string;
      body: string;
      reactions: ReactionsI;
    },
    { rejectWithValue },
  ) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
      return response.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (initialPost: { id: string }, { rejectWithValue }) => {
    const { id } = initialPost;
    try {
      const response = await axios.delete(`${POSTS_URL}/${id}`);
      if (response?.status === 200) {
        return initialPost;
      }
      return rejectWithValue(`${response?.status}: ${response?.statusText}`);
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (
    initialPost: { title: string; body: string; userId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(POSTS_URL, initialPost);
      return response.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

//getSelectors creates these selectors and we rename them with
//aliases using destructing
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts);

export const getPostsSatus = (state: RootState) => {
  return state.posts.status;
};
export const getPostsError = (state: RootState) => state.posts.error;
export const selectPostsByUser = createSelector(
  [selectAllPosts, (_, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId),
);

export const getCount = (state: RootState) => state.posts.count;

export const { postAdded, reactionAdded, increaseCount } = postsSlice.actions;

export default postsSlice.reducer;
