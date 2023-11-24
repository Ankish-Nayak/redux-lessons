import { EntityState, createEntityAdapter } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiSlice } from "../api/apiSlice";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export interface UserI {
  id: string;
  name: string;
}

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(USERS_URL);
      return [...response.data];
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

const usersAdapter = createEntityAdapter<UserI>();

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<UserI>, string>({
      query: () => "/users",
      transformResponse(res: UserI[]) {
        return usersAdapter.setAll(initialState, res);
      },
      providesTags: (res) => {
        return typeof res === "undefined"
          ? [{ type: "User", id: "LIST" }]
          : [
              { type: "User", id: "LIST" },
              ...res.ids.map((id) => ({ type: "User" as const, id })),
            ];
      },
    }),
  }),
});

export const { useGetUsersQuery } = usersApiSlice;

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select("");
