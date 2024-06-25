/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from "./httpClient";
export const getEmployees = async () => {
  try {
    const response = await httpClient.get(`/employee`);

    return response;
  } catch (error: any) {
    return error.response;
  }
};
