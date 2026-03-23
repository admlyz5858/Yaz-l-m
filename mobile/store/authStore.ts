import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthState = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    {
      name: 'zeka-akademi-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ token: s.token }),
    },
  ),
);
