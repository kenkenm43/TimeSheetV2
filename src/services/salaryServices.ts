/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from "./httpClient";

export const addSalary = async (payload: any) => {
  try {
    const response = await httpClient.post(`/salary`, payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
