'use client';
import { useState, useEffect } from 'react';

// Définir la largeur à laquelle la vue bascule vers le mobile
const mobileBreakpoint = 768; 

export default function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    // Définir la valeur initiale au chargement du composant
    handleResize();

    // Ajouter un écouteur d'événement pour les changements de taille de la fenêtre
    window.addEventListener('resize', handleResize);

    // Fonction de nettoyage pour retirer l'écouteur d'événement
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}