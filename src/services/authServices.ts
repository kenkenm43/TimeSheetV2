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
import useAuth from "../hooks/useAuth";
const cookie = new Cookies();
export const register = async (
  payload: UserRegisterPayloadType
  // redirectTo: NavigateFunction
) => {
  try {
    const { data } = await httpClient.post("/auth/register", payload);
    return data;
  } catch (error: any) {
    return error.response;
  }
};

export const login = async (
  payload: UserLoginPayloadType,
  redirectTo: NavigateFunction
) => {
  try {
    const response = await httpClient.post("/auth/login", payload);

    toast.success(response.data.message);
    redirectTo("/", { replace: true });
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message);
    return error.response;
  }
};

export const logout = async (redirectTo: NavigateFunction) => {
  await httpClient.get("/auth/logout");
  await sessionStorage.clear();
  await localStorage.clear();
  await cookie.remove("jwt");
  // redirectTo("/login", { replace: true });
  window.location.reload();
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
