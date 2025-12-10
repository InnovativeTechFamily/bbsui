import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService } from '../services';
import type { UserProfile } from '../services';

interface AuthState {
  // State
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Login user
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await authService.login({ email, password });
            
            if (response.success && response.data) {
              const userData: UserProfile = {
                userId: response.data.userId,
                email: response.data.email,
                fullName: response.data.fullName,
                phoneNumber: '', // Will be fetched separately if needed
                role: response.data.role || 'Customer',
                createdAt: new Date().toISOString(),
                isEmailVerified: true,
              };
              
              set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } else {
              throw new Error(response.message || 'Login failed');
            }
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Invalid credentials',
            });
            throw error;
          }
        },

        // Register user
        register: async (userData: RegisterData) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await authService.register(userData);
            
            if (response.success && response.data) {
              const userProfile: UserProfile = {
                userId: response.data.userId,
                email: response.data.email,
                fullName: response.data.fullName,
                phoneNumber: userData.phoneNumber,
                role: response.data.role || 'Customer',
                createdAt: new Date().toISOString(),
                isEmailVerified: false,
              };
              
              set({
                user: userProfile,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } else {
              throw new Error(response.message || 'Registration failed');
            }
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Registration failed',
            });
            throw error;
          }
        },

        // Logout user
        logout: async () => {
          set({ isLoading: true });
          
          try {
            await authService.logout();
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            // Even if logout API fails, clear local state
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },

        // Check authentication status
        checkAuthStatus: async () => {
          const isAuthenticated = authService.isAuthenticated();
          
          if (isAuthenticated) {
            try {
              const userProfile = await authService.getUserProfile();
              if (userProfile) {
                set({
                  user: userProfile,
                  isAuthenticated: true,
                  error: null,
                });
              } else {
                // Token exists but user profile not found
                set({
                  user: null,
                  isAuthenticated: false,
                  error: 'Session expired. Please login again.',
                });
              }
            } catch (error) {
              set({
                user: null,
                isAuthenticated: false,
                error: 'Failed to verify authentication',
              });
            }
          } else {
            set({
              user: null,
              isAuthenticated: false,
              error: null,
            });
          }
        },

        // Clear error
        clearError: () => set({ error: null }),

        // Set loading state
        setLoading: (loading: boolean) => set({ isLoading: loading }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);