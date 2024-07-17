/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export const useKeepEmployeeStore = create()(persist((set) => ({
    keepEmployee: {
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
    },
    setKeepEmployee: (value) => set((state) => ({
        keepEmployee: { ...state.keepEmployee, ...value },
    })),
}), {
    name: "KeepEmployeeStore",
    storage: createJSONStorage(() => sessionStorage),
}));
export default useKeepEmployeeStore;
