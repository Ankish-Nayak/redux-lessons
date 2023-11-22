import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export interface UserI {
  id: string;
  name: string;
}

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const response = await axios.get(USERS_URL);
    console.log(response);
    return [...response.data];
  } catch (e) {
    return e.message;
  }
});

const initialState: UserI[] = [
  // { id: "0", name: "Ankish Nayak" },
  // { id: "1", name: "Aastha Nayak" },
  // { id: "2", name: "Amber Nayak" },
];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<{ id: number; name: string }[]>) => {
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

export default usersSlice.reducer;
