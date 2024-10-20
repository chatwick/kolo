/* eslint-disable no-unused-vars */
import { IUser } from "@/interfaces/user.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// zustand store for handling user auth states
const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user: IUser) => set({ user }),
      clearUser: () => set({ user: null }),
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state) => {
        state?.setIsLoading(false);
      },
    },
  ),
);

export default useUserStore;
