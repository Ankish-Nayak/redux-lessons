import { createSlice, nanoid } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { PayloadAction } from "@reduxjs/toolkit";
import { sub } from "date-fns";

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

const initialState: PostI[] = [
  {
    id: "1",
    title: "Learning Redux toolkit",
    content: "I have learnt it.",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0,
    },
  },
  {
    id: "2",
    title: "Slices...",
    content: "The more I say slice",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0,
    },
  },
];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<PostI>) {
        state.push(action.payload);
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
      state: RootState,
      action: PayloadAction<{
        postId: string;
        reaction: "string";
      }>,
    ) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.find((post: PostI) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
});

export const selectAllPosts = (state: RootState) => state.posts;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
