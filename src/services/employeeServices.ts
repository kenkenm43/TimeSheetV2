/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigateFunction } from "react-router-dom";
import {
  UserLoginPayloadType,
  UserRegisterPayloadType,
} from "../types/userType";
import httpClient from "./httpClient";
import { toast } from "react-toastify";
import { Cookies } from "react-cookie";
const cookie = new Cookies();

export const addWorkSchedule = async (payload: any, employeeId: any) => {
  try {
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

export const getWorkSchedule = async (employeeId: any) => {
  try {
    const response = await httpClient.get(`/work-schedule/${employeeId}`);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const handleRefreshToken = async () => {
  try {
    const { data } = await httpClient.post("/auth/refresh-tokenV2");
    storeAcessTokenToLocal(data.accessToken);
  } catch (error) {
    console.log(error);
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
