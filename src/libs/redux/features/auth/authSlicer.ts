/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../uistore";
import { AuthStateInterface } from "@/types/auth";
import { set } from "react-hook-form";

export const initialAuth: AuthStateInterface = {
  isLogin: false,
  profile: {
    name: "",
    email: "",
    avatarUrl: "/profile-placeholder.svg",
    role: "",
    userID: "",
    token: "",
  },
};

const authSlicer = createSlice({
  name: "auth",
  initialState: initialAuth,
  reducers: {
    setLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setAvatar: (state, action) => {
      state.profile.avatarUrl = action.payload;
    },
    setName: (state, action) => {
      state.profile.name = action.payload;
    },
    setRole: (state, action) => {
      state.profile.role = action.payload;
    },
    setUserID: (state, action) => {
      state.profile.userID = action.payload;
    },
    setEmail: (state, action) => {
      state.profile.email = action.payload;
    },
  },
});

export const { setLogin, setProfile, setAvatar, setName, setEmail } =
  authSlicer.actions;

export const selectProfile = (state: RootState) =>
  (state.auth as AuthStateInterface).profile;
export const selectAuth = (state: RootState) =>
  (state.auth as AuthStateInterface).isLogin;

export default authSlicer.reducer;
