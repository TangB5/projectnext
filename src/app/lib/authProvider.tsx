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
    token: string;
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

    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/";
    const isAuthenticated = !!session?.user;


    const fetchSession = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("api/auth/me", {
                credentials: "include",
            });

            if (!res.ok) {
                setSession(null);
                setUserData(null);
                return;
            }

            const data = await res.json();
            if (!data?.user) {
                setSession(null);
                setUserData(null);
                return;
            }

            const userSession: Session = {
                token: "", // le token côté client n'est pas accessible si HttpOnly
                user: {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    roles: data.user.roles || [],
                },
            };

            setSession(userSession);
            setUserData(data.user);
        } catch (err) {
            console.error("❌ Erreur récupération session :", err);
            setSession(null);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    // ---------------------------------------------
    // 🚪 Déconnexion : appelle l'API pour supprimer le cookie
    // ---------------------------------------------
    const logout = useCallback(async () => {
        try {
            await fetch(`${API_BASE_URL}api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("❌ Erreur logout :", err);
        } finally {
            setSession(null);
            setUserData(null);
        }
    }, [API_BASE_URL]);

    // ---------------------------------------------
    // ✏️ Mise à jour du profil utilisateur
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

    // ---------------------------------------------
    // 🔁 Charger la session au montage
    // ---------------------------------------------
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
