import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setAvatar(state, action) {
      state.user.avatar = action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
      window.location.href = "/";
    },
  },
});

export const { setUser, setAvatar, logout } = authSlice.actions;

export const selectUser = (state) => state.auth;

export default authSlice.reducer;
