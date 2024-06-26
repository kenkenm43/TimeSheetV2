/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const axiosPrivate = useAxiosPrivate();

export const getUser = async (signal: any, id: any) => {
  return await axiosPrivate.get(`/user/${id}`, { signal: signal });
};

export const addDate = async (signal: any, id: any) => {
  return await axiosPrivate.post("");
};
