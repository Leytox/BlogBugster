import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: "home",
};
const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation(state, action) {
      state.location = action.payload;
    },
  },
});

export const { setLocation } = locationSlice.actions;

export const selectLocation = (state) => state.location;

export default locationSlice.reducer;
