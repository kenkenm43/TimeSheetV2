/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type TRole = {
  id: string;
  name: string;
};

export type TAuth = {
  id: string;
  employeeId: string;
  username: string;
  accessToken: string;
  role: TRole;
};

export type TAuthStoreState = {
  auth: TAuth;
  setAuth: (value: object) => void;
};

export const useAuthStore = create<TAuthStoreState>()(
  persist(
    (set) => ({
      auth: {
        id: "",
        employeeId: "",
        username: "",
        accessToken: "",
        role: { id: "", name: "" },
      },
      setAuth: (value: object) =>
        set((state: any) => ({
          auth: { ...state.auth, ...value },
        })),
    }),
    {
      name: "auth store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
export default useAuthStore;

// auth: { username: "", accessToken: "" },
// setAuth: (value: any) =>
//   set((state: any) => ({
//     auth: { ...state.auth, ...value },
//   })),
