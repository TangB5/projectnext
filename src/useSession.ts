import { useEffect, useState, useCallback } from "react";

const useSession = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3000';

  // Fonction de récupération de session, mémorisée avec useCallback
  const fetchSession = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/session`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSession(data);
        console.log(data)
      } else {
        setSession(null);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de la session :", err);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Exécute la fonction une seule fois au montage du composant
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return { session, loading, fetchSession }; // Exposez fetchSession pour l'utiliser ailleurs
};

export default useSession;