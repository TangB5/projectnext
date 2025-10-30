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
        const products: Product[] = await getProducts();
        const { orders }: { orders: Order[]; total: number } = await getAllOrders();

        const ventes = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

        setStats({
          totalProduits: products.length,
          totalCommandes: orders.length,
          totalVentes: ventes,
          loading: false,
          error: null,
        });
      } catch (err) {
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
