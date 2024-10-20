/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;
}

// zustand store for handling user auth states
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: "",
      setToken: (token: string) => set({ token }),
      clearToken: () => set({ token: "" }),
    }),
    {
      name: "auth-storage",
    },
  ),
);

export default useAuthStore;
