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
        reaction: ReactionI;
      }>,
    ) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find(
        (post: PostI) => post.id === postId,
      );
      if (existingPost) {
        existingPost.reactions[reaction]++;
        //existingPost.reactions[];
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
      // builder
      //   .addCase(fetchPosts.pending, (state: PostsI) => {
      //     state.status = "loading";
      //   })
      //   .addCase(
      //     fetchPosts.fulfilled,
      //     (
      //       state: PostsI,
      //       action: PayloadAction<
      //         {
      //           id: number;
      //           title: string;
      //           userId: number;
      //           body: string;
      //         }[]
      //       >,
      //     ) => {
      //       let min = 1;
      //       const loadedPosts = action.payload.map((post) => {
      //         const newPost: PostI = {
      //           id: post.id.toString(),
      //           userId: post.userId.toString(),
      //           title: post.title,
      //           content: post.body,
      //           date: sub(new Date(), { minutes: min++ }).toISOString(),
      //           reactions: {
      //             thumbsUp: 0,
      //             wow: 0,
      //             heart: 0,
      //             rocket: 0,
      //             coffee: 0,
      //           },
      //         };
      //         return newPost;
      //       });
      //
      //       // adding those post only which dose not exists
      //       state.posts = [
      //         ...state.posts,
      //         ...loadedPosts.filter(
      //           (post1) => !state.posts.some((post2) => post1.id === post2.id),
      //         ),
      //       ];
      //       state.status = "succeeded";
      //     },
      //   )
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
            // reactions: {
            //   thumbsUp: 0,
            //   wow: 0,
            //   heart: 0,
            //   rocket: 0,
            //   coffee: 0,
            // },
          };
          const posts = state.posts.filter(
            (post) => post.id !== action.payload.id.toString(),
          );
          state.posts = [...posts, newPost];
        },
      )
      .addCase(deletePost.fulfilled, (state: PostsI, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = posts;
      });
  },
});

export const fetchPosts = createAsyncThunk("posts/fetchPost", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return [...response.data];
  } catch (e) {
    if (typeof e === "string") {
      return e.toUpperCase(); // works, `e` narrowed to string
    } else if (e instanceof Error) {
      return e.message; // works, `e` narrowed to Error
    }
  }
});

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost: {
    id: number;
    userId: number;
    title: string;
    body: string;
    reactions: ReactionsI;
  }) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
      return response.data;
    } catch (e) {
      // if (typeof e === "string") {
      //   return e.toUpperCase(); // works, `e` narrowed to string
      // } else if (e instanceof Error) {
      //   return e.message; // works, `e` narrowed to Error
      // }
      return e;
      //      return err.message;
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
  async (initialPost: { title: string; body: string; userId: string }) => {
    try {
      const response = await axios.post(POSTS_URL, initialPost);
      return response.data;
    } catch (e) {
      return e;
      // if (typeof e === "string") {
      //   return e.toUpperCase(); // works, `e` narrowed to string
      // } else if (e instanceof Error) {
      //   e.message; // works, `e` narrowed to Error
      // }
    }
  },
);

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsSatus = (state: RootState) => {
  return state.posts.status;
};
export const getPostsError = (state: RootState) => state.posts.error;
export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find((post) => post.id === postId);

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
