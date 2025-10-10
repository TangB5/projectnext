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

// 🚨 CORRECTION CRUCIALE : L'URL de base est vide pour que le proxy Next.js fonctionne.
// Toutes les requêtes sont maintenant relatives à votre frontend (ex: /api/auth/session).
const API_BASE_URL = '';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!session;

    const fetchSession = useCallback(async () => {
        setLoading(true);
        try {
            // 🚨 CORRECTION D'URL : Utilisation du chemin relatif /api/auth/session
            const res = await fetch(`${API_BASE_URL}/api/auth/session`, {
                credentials: 'include',
                // 'no-cache' est bon pour assurer une vérification à jour
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
    }, [API_BASE_URL]); // Garder API_BASE_URL dans useCallback est sécuritaire, même si elle est vide

    const logout = useCallback(async () => {
        try {
            // 🚨 CORRECTION D'URL : Utilisation du chemin relatif /api/auth/logout
            await fetch(`${API_BASE_URL}/api/auth/logout`, {
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