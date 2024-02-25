import { NavigateFunction } from "react-router-dom";
import {
  UserLoginPayloadType,
  UserRegisterPayloadType,
} from "../types/userType";
import httpClient from "./httpClient";

export const register = async (
  payload: UserRegisterPayloadType,
  redirectTo: NavigateFunction
) => {
  try {
    const { data } = await httpClient.post("auth/register", payload);
    storeAcessTokenToLocal(data.accessToken);
    storeRefreshTokenToLocal(data.refreshToken);
    redirectTo("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

export const login = async (
  payload: UserLoginPayloadType,
  redirectTo: NavigateFunction
) => {
  try {
    const { data } = await httpClient.post("auth/login", payload);
    storeAcessTokenToLocal(data.accessToken);
    storeRefreshTokenToLocal(data.refreshToken);
    redirectTo("/dashboard");
  } catch (error) {
    console.log(error);
  }
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
