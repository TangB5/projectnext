'use client';
import { useState, useEffect } from 'react';
import { getProducts, getAllOrders } from '@/app/lib/Service';
import { Product, Order } from '@/app/types';

export interface DashboardStats {
  totalVentes: number;
  totalCommandes: number;
  totalProduits: number;
  loading: boolean;
  error: string | null;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVentes: 0,
    totalCommandes: 0,
    totalProduits: 0,
    loading: true,
    error: null,
  });

    useEffect(() => {
        async function fetchData() {
            try {
                // 🌟 CORRECTION 1 : Récupérer l'objet de réponse complet pour les produits
                const productResponse = await getProducts();

                // 🌟 CORRECTION 2 : Extraire le tableau 'products'
                const productsArray: Product[] = productResponse.products || [];

                const { orders }: { orders: Order[]; total: number } = await getAllOrders();

                // Le calcul des ventes utilise le tableau extrait
                const ventes = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

                setStats({
                    totalProduits: productsArray.length, // Utilisation du tableau extrait
                    totalCommandes: orders.length,
                    totalVentes: ventes,
                    loading: false,
                    error: null,
                });
            }
            catch (err) {
                console.error('Erreur lors du chargement des données:', err);
                setStats(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Impossible de charger les statistiques',
                }));
            }
        }

        fetchData();
    }, []);
  return stats;
}
