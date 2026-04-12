import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface Modal {
  id: string;
  component: string;
  props?: Record<string, any>;
}

interface UIState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Modals
  modals: Modal[];
  openModal: (modal: Omit<Modal, 'id'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  // Global loading
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Confirmation dialog
  confirmDialog: {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    variant?: 'default' | 'destructive';
  } | null;
  showConfirmDialog: (config: Omit<NonNullable<UIState['confirmDialog']>, 'open'>) => void;
  closeConfirmDialog: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Sidebar
      sidebarOpen: true,
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Mobile menu
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      // Toasts
      toasts: [],
      addToast: (toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }));

        // Auto-remove after duration
        const duration = toast.duration ?? 5000;
        if (duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        }
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
      clearToasts: () => set({ toasts: [] }),

      // Modals
      modals: [],
      openModal: (modal) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          modals: [...state.modals, { ...modal, id }],
        }));
      },
      closeModal: (id) =>
        set((state) => ({
          modals: state.modals.filter((m) => m.id !== id),
        })),
      closeAllModals: () => set({ modals: [] }),

      // Global loading
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      // Confirmation dialog
      confirmDialog: null,
      showConfirmDialog: (config) =>
        set({
          confirmDialog: { ...config, open: true },
        }),
      closeConfirmDialog: () => set({ confirmDialog: null }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist user preferences
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// Convenience functions for toasts
export const toast = {
  success: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'success', title, message }),
  error: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'error', title, message }),
  warning: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'warning', title, message }),
  info: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'info', title, message }),
};

// Convenience function for confirm dialog
export const confirm = (config: Parameters<UIState['showConfirmDialog']>[0]) =>
  new Promise<boolean>((resolve) => {
    useUIStore.getState().showConfirmDialog({
      ...config,
      onConfirm: () => {
        config.onConfirm?.();
        resolve(true);
        useUIStore.getState().closeConfirmDialog();
      },
      onCancel: () => {
        config.onCancel?.();
        resolve(false);
        useUIStore.getState().closeConfirmDialog();
      },
    });
  });
