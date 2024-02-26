/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigateFunction } from "react-router-dom";
import {
  UserLoginPayloadType,
  UserRegisterPayloadType,
} from "../types/userType";
import httpClient from "./httpClient";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

export const register = async (
  payload: UserRegisterPayloadType
  // redirectTo: NavigateFunction
) => {
  try {
    const { data } = await httpClient.post("auth/register", payload);
    storeAcessTokenToLocal(data.accessToken);
    storeRefreshTokenToLocal(data.refreshToken);
    // redirectTo("/dashboard");
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
    const response = await httpClient.post("/auth/login", payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    console.log(JSON.stringify(response?.data));

    const { data } = response;
    toast.success(response.data.message);
    storeAcessTokenToLocal(data.accessToken);
    storeRefreshTokenToLocal(data.refreshToken);
    // redirectTo("/");
    const { setAuth }: any = useAuth();
    setAuth((prev: any): any => {
      console.log(prev);
    });
    return response;
  } catch (error: any) {
    toast.error(error.response.data.message);
    return error.response;
  }
  // return error;
};

export const logout = (redirectTo: NavigateFunction) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  redirectTo("/login");
};

export const handleRefreshToken = async () => {
  try {
    const { data } = await httpClient.post("auth/refresh-token");
    storeAcessTokenToLocal(data.accessToken);
    storeRefreshTokenToLocal(data.refreshToken);
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (email: string): Promise<boolean> => {
  try {
    await httpClient.post("auth/forgot-password", { email });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const storeAcessTokenToLocal = (accessToken: string): void =>
  localStorage.setItem("accessToken", accessToken);

const storeRefreshTokenToLocal = (refreshToken: string): void =>
  localStorage.setItem("refreshToken", refreshToken);
