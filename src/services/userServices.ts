/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const getUser = async (signal: any, id: any) => {
  const axiosPrivate = useAxiosPrivate();
  return await axiosPrivate.get(`/user/${id}`, { signal: signal });
};
