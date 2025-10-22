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

    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "";
    const isAuthenticated = !!session?.user;

    // ----------------------------
    // 🔁 Récupère la session utilisateur
    // ----------------------------
    const fetchSession = useCallback(async () => {
        setLoading(true);
        try {
            // Toujours utiliser slash initial pour éviter les chemins relatifs incorrects
            const url = typeof window !== "undefined" ? "/api/auth/me" : `${FRONTEND_BASE_URL}/api/auth/me`;

            const res = await fetch(url, {
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
                token: "", // Le token peut être stocké ailleurs si nécessaire
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
    }, [FRONTEND_BASE_URL]);

    // ----------------------------
    // 🚪 Déconnexion
    // ----------------------------
    const logout = useCallback(async () => {
        try {
            const url = typeof window !== "undefined" ? "/api/auth/logout" : `${FRONTEND_BASE_URL}/api/auth/logout`;

            await fetch(url, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("❌ Erreur logout :", err);
        } finally {
            setSession(null);
            setUserData(null);
        }
    }, [FRONTEND_BASE_URL]);

    // ----------------------------
    // ✏️ Mise à jour du profil utilisateur
    // ----------------------------
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

    // ----------------------------
    // 🔄 Charger la session au montage
    // ----------------------------
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
