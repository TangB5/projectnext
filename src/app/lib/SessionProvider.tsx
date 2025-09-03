'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getSession as fetchSession } from './session'; // Renommage pour plus de clarté
import type { SessionPayload } from './type';

// Définition du contexte de session
type SessionContextType = {
  session: SessionPayload | null;
  loading: boolean;
};
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Le composant "Provider" qui encapsule l'application
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [loading, setLoading] = useState(true);

  // Utilisation de useEffect pour charger la session côté client
  useEffect(() => {
    async function loadSession() {
      // Appel de la fonction "Server Action" depuis le client
      const currentSession = await fetchSession();
      setSession(currentSession);
      setLoading(false);
    }
    loadSession();
  }, []); // Le tableau vide assure que l'effet ne s'exécute qu'une seule fois

  return (
    <SessionContext.Provider value={{ session, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

// Le hook personnalisé pour consommer le contexte
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession doit être utilisé à l\'intérieur d\'un SessionProvider');
  }
  return context;
}