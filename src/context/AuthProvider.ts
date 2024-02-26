/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

const useAuthStore = create((set) => ({
  count: 1,
  arr: ["awdawd"],
  authy: { username: "1", accessToken: "" },
  inc: () => set((state: any) => ({ count: state.count + 1 })),
  setAuth: () =>
    set((state: any) => ({
      auth: { ...state.auth, accessToken: "dadkmakwdm" },
    })),
}));

export default useAuthStore;
