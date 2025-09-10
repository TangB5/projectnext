import { useState, useCallback } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérification réelle de l'authentification
  const checkAuth = useCallback(() => {
    const authToken = document.cookie.includes('authToken');
    setIsAuthenticated(authToken);
    return authToken;
  }, []);

  return {
    isAuthenticated,
    checkAuth
  };
};