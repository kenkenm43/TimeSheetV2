/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDebugValue } from "react";
import useAuthStore from "../context/AuthProvider";
const useAuth = () => {
    const { auth, setAuth } = useAuthStore();
    useDebugValue(auth, (auth) => (auth?.username ? "Logged In" : "Logged Out"));
    return { auth, setAuth };
};
export default useAuth;
