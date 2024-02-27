/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

type TRole = {
  id: string;
  name: string;
};

type TAuth = {
  username: string;
  accessToken: string;
  role: TRole;
};

type TAuthStoreState = {
  auth: TAuth;
  setAuth: (value: object) => void;
};

export const useAuthStore = create<TAuthStoreState>()(
  persist(
    (set) => ({
      auth: { username: "", accessToken: "", role: { id: "", name: "" } },
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
