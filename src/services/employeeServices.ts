/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from "./httpClient";

export const addWorkSchedule = async (payload: any, employeeId: any) => {
  try {
    console.log(payload, employeeId);

    const response = await httpClient.post(
      `/work-schedule/${employeeId}`,
      payload
    );

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const addLeave = async (payload: any, employeeId: any) => {
  try {
    const response = await httpClient.post(`/leave/${employeeId}`, payload);

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getEmployee = async (employeeId: any) => {
  try {
    const response = await httpClient.get(`/employee/${employeeId}`);

    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getWorkSchedules = async (employeeId: any) => {
  try {
    const response = await httpClient.get(`/work-schedule/${employeeId}`);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const updateWorkSchedule = async (employeeId: any) => {
  try {
    const response = await httpClient.patch(`/work-schedule/${employeeId}`);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getLeaves = async (employeeId: any) => {
  try {
    const response = await httpClient.get(`/leave/${employeeId}`);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const forgotPassword = async (email: string): Promise<boolean> => {
  try {
    await httpClient.post("/auth/forgot-password", { email });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const storeAcessTokenToLocal = (accessToken: string): void => {
  localStorage.setItem("accessToken", accessToken);
};
