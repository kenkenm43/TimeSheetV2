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
export const getSalaryByEmpId = async (payload: any, employeeId: any) => {
  try {
    const response = await httpClient.get(
      `/salary?empId=${employeeId}&month=${payload.month}&year=${payload.year}`,
      payload
    );
    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const updateSalaryById = async (payload: any) => {
  try {
    const response = await httpClient.put(`/salary`, payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
