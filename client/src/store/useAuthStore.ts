// src/store/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userEmail: null,
  setUserEmail: (email) => set({ userEmail: email }),
}));
