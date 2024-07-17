/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export const useEmployeeStore = create()(persist((set) => ({
    employee: {
        id: "",
        firstName: "",
        lastName: "",
        nickName: "",
        idCard: "",
        gender: "",
        date_of_birth: "",
        address: "",
        phone_number: "",
        email: "",
        photo: "",
        events: [],
    },
    setEmployee: (value) => set((state) => ({
        employee: { ...state.employee, ...value },
    })),
}), {
    name: "EmployeeStore",
    storage: createJSONStorage(() => sessionStorage),
}));
export default useEmployeeStore;
// auth: { username: "", accessToken: "" },
// setAuth: (value: any) =>
//   set((state: any) => ({
//     auth: { ...state.auth, ...value },
//   })),
