/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

type TRole = {
  id: string;
  name: string;
};

type TUser = {
  username: string;
  firstName: string;
  lastName: string;
  idCard: string;
};

type TUserStoreState = {
  user: TUser;
  setUser: (value: object) => void;
};

export const useUserStore = create<TUserStoreState>()(
  persist(
    (set) => ({
      user: {
        username: "",
        firstName: "",
        lastName: "",
        idCard: "",
      },
      setUser: (value: object) =>
        set((state: any) => ({
          user: { ...state.user, ...value },
        })),
    }),
    {
      name: "userstore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
export default useUserStore;

// auth: { username: "", accessToken: "" },
// setAuth: (value: any) =>
//   set((state: any) => ({
//     auth: { ...state.auth, ...value },
//   })),
