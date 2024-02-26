/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDebugValue } from "react";
import useAuthStore from "../context/AuthProvider";

const useAuth = () => {
  const { auth, setAuth, count, inc }: any = useAuthStore();
  useDebugValue(auth, (auth) => (auth?.username ? "Logged In" : "Logged Out"));
  return { auth, setAuth, count, inc };
};

export default useAuth;
