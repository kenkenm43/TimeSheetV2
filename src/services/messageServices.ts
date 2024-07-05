/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from "./httpClient";
export const getEmployee = async (employeeId: any) => {
  try {
    const response = await httpClient.get(`/employee/${employeeId}`);

    return response;
  } catch (error: any) {
    return error.response;
  }
};
