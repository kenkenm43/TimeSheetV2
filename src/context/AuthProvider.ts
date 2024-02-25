import { createContext, useState } from "react";
import create from "zustand";
const AuthContext = createContext({});

const useStore = create((set) => ({
  auth: "da",
  accessToken: "",
  refreshToken: "",
  setAccessToken: () => {},
}));

export default useStore;
