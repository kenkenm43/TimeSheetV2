/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useAxiosPrivate from "../hooks/useAxiosPrivate";
export const getUsers = async (signal: any) => {
  const axiosPrivate = useAxiosPrivate();
  return await axiosPrivate.get("/users", { signal: signal });
};
