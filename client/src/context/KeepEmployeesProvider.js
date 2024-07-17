/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export const useKeepEmployeesStore = create()(persist((set) => ({
    employees: [],
    setEmployees: (value) => set((state) => ({
        employees: value,
    })),
    setEvents: (empId, events) => set((state) => ({
        employees: state.employees.map((emp) => emp.id === empId ? { ...emp, events } : emp),
    })),
}), {
    name: "KeepEmployeesStore",
    storage: createJSONStorage(() => sessionStorage),
}));
export default useKeepEmployeesStore;
