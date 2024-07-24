/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type TLogin = {
  page: string;
  email: string;
  otp: string;
};

export type TLoginStoreState = {
  loginD: TLogin;
  setLoginD: (value: object) => void;
};

export const useRecovery = create<any>()((set) => ({
  page: "login",
  email: "",
  otp: "",
  setPage: (value: any) =>
    set((state: any) => ({
      page: value,
    })),
  setEmail: (value: any) =>
    set((state: any) => ({
      email: value,
    })),
  setOTP: (value: any) =>
    set((state: any) => ({
      otp: value,
    })),
}));
export default useRecovery;
