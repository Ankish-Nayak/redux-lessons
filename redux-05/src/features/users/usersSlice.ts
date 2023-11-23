import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
      console.log(response);
      return [...response.data];
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

const initialState: UserI[] = [];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      fetchUsers.fulfilled,
      (_, action: PayloadAction<{ id: number; name: string }[]>) => {
        console.log(action.payload);
        return action.payload.map((user) => {
          return {
            id: user.id.toString(),
            name: user.name,
          };
        });
      },
    );
  },
});

export const selectAllUsers = (state: RootState) => state.users;

export const selectUsersById = (state: RootState, userId: string) =>
  state.users.find((user) => user.id === userId);

export default usersSlice.reducer;
