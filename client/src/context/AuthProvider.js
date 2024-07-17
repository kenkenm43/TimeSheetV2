/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export const useAuthStore = create()(persist((set) => ({
    auth: {
        id: "",
        employeeId: "",
        username: "",
        accessToken: "",
        role: { id: "", name: "" },
    },
    setAuth: (value) => set((state) => ({
        auth: { ...state.auth, ...value },
    })),
}), {
    name: "auth store",
    storage: createJSONStorage(() => sessionStorage),
}));
export default useAuthStore;
// auth: { username: "", accessToken: "" },
// setAuth: (value: any) =>
//   set((state: any) => ({
//     auth: { ...state.auth, ...value },
//   })),
