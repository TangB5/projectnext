import { useCallback } from 'react';
import { Product, OrderItem } from '@/app/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useApi = () => {
  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    const res = await fetch(`${API_BASE_URL}api/products`, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : data.products || [];
  }, []);

  const createOrder = useCallback(async (orderItems: OrderItem[]): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ products: orderItems }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Erreur lors de la commande");
    }
  }, []);

  return {
    fetchProducts,
    createOrder
  };
};