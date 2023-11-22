import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface UserI {
  id: string;
  name: string;
}

const initialState: UserI[] = [
  { id: "0", name: "Ankish Nayak" },
  { id: "1", name: "Aastha Nayak" },
  { id: "2", name: "Amber Nayak" },
];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export const selectAllUsers = (state: RootState) => state.users;

export default usersSlice.reducer;
