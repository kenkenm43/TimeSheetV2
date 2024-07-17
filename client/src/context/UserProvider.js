/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export const useUserStore = create()(persist((set) => ({
    user: {
        username: "",
        firstName: "",
        lastName: "",
        idCard: "",
    },
    setUser: (value) => set((state) => ({
        user: { ...state.user, ...value },
    })),
}), {
    name: "userstore",
    storage: createJSONStorage(() => sessionStorage),
}));
export default useUserStore;
// auth: { username: "", accessToken: "" },
// setAuth: (value: any) =>
//   set((state: any) => ({
//     auth: { ...state.auth, ...value },
//   })),
