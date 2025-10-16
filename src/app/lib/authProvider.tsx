'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from 'react';

import { User } from "@/app/types";

export interface Session {
    user: {
        id: string;
        name: string;
        email: string;
        roles?: string[];
    };
}

interface AuthContextType {
    user: User | null; // ✅ accès direct à l’utilisateur
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
    const API_BASE_URL=process.env.NEXT_PUBLIC_BACKEND_URL;
    const isAuthenticated = !!session?.user;
    const user: User | null = session
        ? {
            _id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            roles: session.user.roles ?? [],
        }
        : null;

    const fetchSession = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}api/auth/session`, {
                cache: "no-store",
                credentials: "include"
            });
            if (res.ok) {
                const data: Session | null = await res.json();
                setSession(data);
            } else {
                setSession(null);
            }
        } catch (err) {
            console.error("❌ Erreur récupération session :", err);
            setSession(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (err) {
            console.error("❌ Erreur logout :", err);
        } finally {
            setSession(null);
        }
    }, []);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    return (
        <AuthContext.Provider
            value={{
                user,             // ✅ ajouté
                session,
                isAuthenticated,
                loading,
                refreshSession: fetchSession,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
    return context;
}
