/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from "./httpClient";
export const getEmployees = async (payload: any) => {
  try {
    const response = await httpClient.get(
      `/employee?roleQuery=${payload.roleQuery}`
    );

    return response;
  } catch (error: any) {
    return error.response;
  }
};
