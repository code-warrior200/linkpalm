import { create } from 'zustand';
import { User, UserRole } from './types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isPostLoginLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isPostLoginLoading: false,

  login: async (email: string, password: string, role: UserRole): Promise<void> => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, validate credentials with backend
    if (email && password) {
      set({
        user: {
          id: '1',
          email,
          name: email.split('@')[0],
          role,
        },
        isLoading: false,
      });
      
      // Show post-login loader for 2 seconds
      set({ isPostLoginLoading: true });
      setTimeout(() => {
        set({ isPostLoginLoading: false });
      }, 2000);
    } else {
      set({ isLoading: false });
      throw new Error('Invalid credentials');
    }
  },

  signUp: async (email: string, password: string, name: string, role: UserRole): Promise<void> => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock signup - in real app, create user account with backend
    if (email && password && name) {
      set({
        user: {
          id: Date.now().toString(),
          email,
          name,
          role,
        },
        isLoading: false,
      });
      
      // Show post-login loader for 2 seconds
      set({ isPostLoginLoading: true });
      setTimeout(() => {
        set({ isPostLoginLoading: false });
      }, 2000);
    } else {
      set({ isLoading: false });
      throw new Error('Please fill in all fields');
    }
  },

  logout: (): void => {
    set({ user: null, isPostLoginLoading: false });
  },
}));

