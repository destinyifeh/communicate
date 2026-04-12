import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { authService } from '@/services';
import { useAuthStore } from '@/stores';
import { queryKeys } from '@/lib/query-client';
import { generateSlug } from '@/lib/subdomain';
import type { LoginCredentials, SignupData, ProfileUpdateData, User } from '@/types';

// Re-export types for backwards compatibility
export type { User };
export type UserRole = 'admin' | 'client';

/**
 * Hook for authentication operations
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const { user, setUser, setLoading, setInitialized, logout: clearAuth } = useAuthStore();

  // Session query - fetches user on mount
  const sessionQuery = useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: async () => {
      // Check for auth token in URL (cross-subdomain redirect)
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const authToken = urlParams.get('auth');

        if (authToken) {
          try {
            const userData = JSON.parse(atob(authToken)) as User;
            // Clean up URL
            urlParams.delete('auth');
            const newUrl = urlParams.toString()
              ? `${window.location.pathname}?${urlParams.toString()}`
              : window.location.pathname;
            window.history.replaceState({}, '', newUrl);
            return { user: userData };
          } catch (e) {
            console.error('Failed to parse auth token:', e);
          }
        }
      }

      return authService.getSession();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  // Sync session data with store
  useEffect(() => {
    if (sessionQuery.data?.user) {
      setUser(sessionQuery.data.user);
    } else if (sessionQuery.isSuccess && !sessionQuery.data?.user) {
      setUser(null);
    }

    if (!sessionQuery.isLoading) {
      setLoading(false);
      setInitialized(true);
    }
  }, [sessionQuery.data, sessionQuery.isSuccess, sessionQuery.isLoading, setUser, setLoading, setInitialized]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      const userData = data.user;

      // Generate businessSlug if not present
      if (userData.role === 'client' && !userData.businessSlug && userData.businessName) {
        userData.businessSlug = generateSlug(userData.businessName);
      }

      setUser(userData);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: (data: SignupData) => authService.signup(data),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
    onError: () => {
      // Clear even on error
      clearAuth();
      queryClient.clear();
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileUpdateData) => authService.updateProfile(data),
    onSuccess: (data) => {
      if (user) {
        setUser({ ...user, ...data.user });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });

  // Actions
  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginMutation.mutateAsync({ email, password });
      return result.user;
    },
    [loginMutation]
  );

  const signup = useCallback(
    async (data: SignupData) => {
      const result = await signupMutation.mutateAsync(data);
      return result.user;
    },
    [signupMutation]
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const updateProfile = useCallback(
    async (data: ProfileUpdateData) => {
      const result = await updateProfileMutation.mutateAsync(data);
      return result.user;
    },
    [updateProfileMutation]
  );

  const refreshSession = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
  }, [queryClient]);

  // Legacy compatibility methods from AuthContext
  const updateBusinessSlug = useCallback(
    (slug: string) => {
      if (user) {
        // Optimistically update the store
        useAuthStore.getState().updateUser({ businessSlug: slug });
        // Persist to backend
        updateProfileMutation.mutate({ businessSlug: slug });
      }
    },
    [user, updateProfileMutation]
  );

  const updateBranding = useCallback(
    (branding: { businessLogo?: string; brandColor?: string; businessName?: string }) => {
      if (user) {
        // Optimistically update the store
        useAuthStore.getState().updateUser(branding);
        // Persist to backend
        updateProfileMutation.mutate(branding);
      }
    },
    [user, updateProfileMutation]
  );

  return {
    // State
    user,
    isAuthenticated: !!user,
    isLoading: sessionQuery.isLoading || loginMutation.isPending || signupMutation.isPending,
    isInitialized: useAuthStore((state) => state.isInitialized),

    // Actions
    login,
    signup,
    logout,
    updateProfile,
    refreshSession,
    updateBusinessSlug,
    updateBranding,

    // Mutation states for UI
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
}

/**
 * Hook for profile data
 */
export function useProfile() {
  const { user } = useAuthStore();

  const profileQuery = useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: () => authService.getProfile(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
  };
}
