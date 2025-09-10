import { useEffect, useState, useCallback } from "react";
export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    roles?: string[];
  };
}

const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  // fetchSession accepte un signal optionnel
  const fetchSession = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}api/session`, {
          credentials: "include",
          signal,
        });

        if (res.ok) {
          const data: Session = await res.json();
          setSession(data);
          setIsAuthenticated(true);
        } else {
          setSession(null);
          setIsAuthenticated(false);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // requête annulée
        } else {
          console.error("Erreur lors de la récupération de la session :", err);
          setSession(null);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    },
    [API_BASE_URL]
  );

 
  const logout = useCallback(async () => {
  try {
    await fetch(`${API_BASE_URL}api/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Erreur lors du logout :", err);
  } finally {
    setSession(null);
    setIsAuthenticated(false);
  }
}, [API_BASE_URL]);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    fetchSession(controller.signal);

    return () => controller.abort();
  }, [fetchSession]);

  return { session, isAuthenticated, loading, refreshSession: fetchSession, logout };
};

export default useAuth;
