import { Product } from '@/app/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const useProductApi = () => {
  const fetchProducts = async (): Promise<Product[]> => {
    const res = await fetch(`${API_BASE_URL}api/products`);
    
    if (!res.ok) {
      throw new Error('Erreur lors du chargement des produits');
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : data.products || [];
  };

  const toggleProductLike = async (productId: string, like: boolean): Promise<Product> => {
    const res = await fetch(`${API_BASE_URL}api/products/${productId}/toggle-like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ like }),
    });

    if (!res.ok) {
      throw new Error('Échec de la mise à jour des likes sur le serveur');
    }

    const { product } = await res.json();
    return product;
  };

  return {
    fetchProducts,
    toggleProductLike,
  };
};