'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    roles?: string[];
  };
}

interface AuthContextType {
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!session;

  const fetchSession = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}api/session`, {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (res.ok) {
        const data: Session | null = await res.json();
        setSession(data);
      } else {
        setSession(null);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de la session :', err);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Erreur lors du logout :', err);
    } finally {
      setSession(null);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const value = {
    session,
    isAuthenticated,
    loading,
    refreshSession: fetchSession,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}