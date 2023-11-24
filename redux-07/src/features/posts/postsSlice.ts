import {
  createEntityAdapter,
  createSelector,
  EntityState,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";

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

export interface PostApiResI {
  id: number;
  userId: number;
  title: string;
  body: string;
  date?: string;
  reactions?: ReactionsI;
}

const postsAdapter = createEntityAdapter<PostI>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});
const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<EntityState<PostI>, void>({
      query: () => "/posts",
      transformResponse: (res: PostApiResI[]) => {
        let min = 1;
        const loadedPosts = res.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions) {
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          }
          const newPost: PostI = {
            id: post.id.toString(),
            userId: post.userId.toString(),
            title: post.title,
            content: post.body,
            date: post.date,
            reactions: post.reactions,
          };

          return newPost;
        });

        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) => {
        return typeof result === "undefined"
          ? [{ type: "Post", id: "LIST" }]
          : [
              { type: "Post", id: "LIST" },
              ...result.ids.map((id) => ({ type: "Post" as const, id })),
            ];
      },
    }),
    getPostsByUserId: builder.query<EntityState<PostI>, string>({
      query: (id) => `/posts/?userId=${id}`,
      transformResponse: (res: PostApiResI[]) => {
        let min = 1;
        const loadedPosts = res.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions) {
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          }
          const newPost: PostI = {
            id: post.id.toString(),
            userId: post.userId.toString(),
            title: post.title,
            content: post.body,
            date: post.date,
            reactions: post.reactions,
          };

          return newPost;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      porvidesTags: (result) => {
        return typeof result === "undefined"
          ? []
          : [...result.ids.map((id) => ({ type: "Post" as const, id }))];
      },
    }),
    addNewPost: builder.mutation<void, Omit<PostApiResI, "id">>({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation<void, PostApiResI>({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (_, __, arg) => [{ type: "Post", id: arg.id }],
    }),
    deletePost: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/post/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_, __, arg) => [{ type: "Post", id: arg.id }],
    }),
    addReaction: builder.mutation<
      void,
      {
        postId: string;
        reactions: ReactionsI;
      }
    >({
      query: ({ postId, reactions }) => ({
        url: `/posts/${postId}`,
        method: "PATCH",
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            "getPosts",
            undefined,
            (draft) => {
              const post = draft.entities[postId];
              if (post) post.reactions = reactions;
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;

export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(
  [selectPostsResult],
  (postsResult) => postsResult.data, // normalized state object with ids and entities
);

//getSelectors creates these selectors and we rename them with
//aliases using destructing
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors<RootState>(
  (state) => selectPostsData(state) ?? initialState,
);
