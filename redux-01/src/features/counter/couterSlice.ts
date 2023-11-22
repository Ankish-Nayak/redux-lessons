import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CounterI {
  count: number;
}

const initialState: CounterI = {
  count: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.count++;
    },
    decrement: (state) => {
      state.count--;
    },
    reset: (state) => {
      state.count = 0;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    },
    decrementByAmount: (state, action: PayloadAction<number>) => {
      state.count -= action.payload;
    },
  },
});

// exporting actions
export const { increment, decrement, incrementByAmount, decrementByAmount } =
  counterSlice.actions;

// exporting reducer
export default counterSlice.reducer;
