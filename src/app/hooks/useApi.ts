import { useCallback } from 'react';
import { Product, OrderRequest } from '@/app/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useApi = () => {
    // Récupération des produits
    const fetchProducts = useCallback(async (): Promise<Product[]> => {
        const res = await fetch(`${API_BASE_URL}api/products`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        return Array.isArray(data) ? data : data.products || [];
    }, []);

    // Création d'une commande
    const createOrder = useCallback(async (order: OrderRequest): Promise<void> => {
        if (!order.userId) throw new Error("Utilisateur non authentifié");
        if (!order.details?.address?.trim()) throw new Error("Adresse obligatoire");

        const res = await fetch(`${API_BASE_URL}api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(order),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || 'Erreur lors de la création de la commande');
        }
    }, []);

    return {
        fetchProducts,
        createOrder,
    };
};
