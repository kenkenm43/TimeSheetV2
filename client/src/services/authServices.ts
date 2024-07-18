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

export const handleRegister = async (
  payload: UserRegisterPayloadType,
  redirectTo: NavigateFunction
) => {
  try {
    const response = await httpClient.post("/auth/register", payload);
    redirectTo("/", { replace: true });
    toast.success(response.data.message);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const login = async (payload: UserLoginPayloadType) => {
  console.log("http", httpClient);

  try {
    const response = await httpClient.post("/auth/login", payload);

    return response;
  } catch (error: any) {
    toast.error(error.response.data.message);
    return error.response;
  }
};

export const logout = async () => {
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
