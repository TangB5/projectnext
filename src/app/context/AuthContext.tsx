'use client';

import { createContext, useContext, ReactNode } from 'react';
import useAuthOriginal, { Session } from '@/app/hooks/useAuth';

type AuthContextType = {
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshSession: (signal?: AbortSignal) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthOriginal(); // ton hook existant

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
