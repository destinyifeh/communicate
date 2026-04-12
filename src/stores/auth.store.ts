import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, UserRole } from '@/types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;

  // Selectors (computed)
  isAdmin: () => boolean;
  isClient: () => boolean;
  getBusinessSlug: () => string | undefined;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isInitialized: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setInitialized: (isInitialized) => set({ isInitialized }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      // Selectors
      isAdmin: () => get().user?.role === 'admin',
      isClient: () => get().user?.role === 'client',
      getBusinessSlug: () => get().user?.businessSlug,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // Only persist essential auth state, not loading states
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for use outside of React components
export const authSelectors = {
  getUser: () => useAuthStore.getState().user,
  isAuthenticated: () => useAuthStore.getState().isAuthenticated,
  isAdmin: () => useAuthStore.getState().user?.role === 'admin',
  getBusinessSlug: () => useAuthStore.getState().user?.businessSlug,
};
