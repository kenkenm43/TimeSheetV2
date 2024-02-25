import { createContext, useState } from "react";
import create from "zustand";
import { UserType } from "../types/userType";
const AuthContext = createContext({});

type State = UserType;

type Action = {
  updateRefreshToken: (refreshToken: State["refreshToken"]) => void;
};

const useAuthStore = create<State & Action>((set) => ({}));

const useStore = create((set) => ({
  auth: "da",
  accessToken: "",
  refreshToken: "",
  setAccessToken: () => {},
}));

export default useStore;
