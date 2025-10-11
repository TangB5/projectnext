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

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!session;

    const fetchSession = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/session", { cache: "no-store" });
            if (res.ok) {
                const data: Session | null = await res.json();
                setSession(data);
            } else {
                setSession(null);
            }
        } catch (err) {
            console.error("Erreur récupération session :", err);
            setSession(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (err) {
            console.error("Erreur logout :", err);
        } finally {
            setSession(null);
        }
    }, []);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    return (
        <AuthContext.Provider value={{ session, isAuthenticated, loading, refreshSession: fetchSession, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
    return context;
}
