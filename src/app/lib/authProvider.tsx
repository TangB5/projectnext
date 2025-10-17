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
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
    loading: boolean;
    refreshSession: () => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const isAuthenticated = !!session?.user;

    // ---------------------------------------------
    // Récupération de la session et données user
    // ---------------------------------------------
    const fetchSession = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/session", {
                cache: "no-store",
                credentials: "include",
            });

            if (res.ok) {
                const data: Session | null = await res.json();
                setSession(data);

                if (data?.user?.id) {
                    const userRes = await fetch(`${API_BASE_URL}api/users/${data.user.id}`,
                        {
                            credentials: "include",
                        }
                    );
                    if (userRes.ok) {
                        const userData: User = await userRes.json();
                        setUserData(userData);
                    }
                }
            } else {
                setSession(null);
                setUserData(null);
            }
        } catch (err) {
            console.error(" Erreur récupération session :", err);
            setSession(null);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    // ---------------------------------------------
    // Déconnexion
    // ---------------------------------------------
    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (err) {
            console.error("❌ Erreur logout :", err);
        } finally {
            setSession(null);
            setUserData(null);
        }
    }, []);

    // ---------------------------------------------
    // Mise à jour du profil utilisateur
    // ---------------------------------------------
    const updateProfile = useCallback(
        async (data: Partial<User>): Promise<User | null> => {
            if (!userData?._id) return null;
            try {
                const formData = new FormData();

                Object.entries(data).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (key === "avatar" && value instanceof File) {
                            formData.append("avatar", value);
                        } else if (["address", "preferences"].includes(key)) {
                            // stringify pour objets imbriqués
                            formData.append(key, JSON.stringify(value));
                        } else {
                            formData.append(key, value as string);
                        }
                    }
                });

                const res = await fetch(`${API_BASE_URL}api/users/${userData._id}`, {
                    method: "PUT",
                    body: formData,
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Erreur mise à jour du profil");

                const updatedUser: User = await res.json();
                setUserData(updatedUser);
                return updatedUser;
            } catch (err) {
                console.error("❌ updateProfile error:", err);
                return null;
            }
        },
        [API_BASE_URL, userData?._id]
    );

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    return (
        <AuthContext.Provider
            value={{
                user: userData,
                session,
                isAuthenticated,
                loading,
                refreshSession: fetchSession,
                logout,
                updateProfile,
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
