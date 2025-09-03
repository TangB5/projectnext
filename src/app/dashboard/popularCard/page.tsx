'use client'

import { useState, useEffect } from 'react';
import 'primeicons/primeicons.css';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Correction de l'interface pour correspondre au backend
type Product = {
  _id: string;
  name: string;
  image: string;
  price: number;
  likes: number;
  category?: string;
  isNew?: boolean;
};

export default function Popular() {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        // Assurez-vous que cette route existe et renvoie le bon format
        const res = await fetch('/api/products/popular');
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des produits populaires');
        }
        const data: Product[] = await res.json();
        setPopularProducts(data.slice(0, 5));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPopularProducts();
  }, []);

  const calculateTrend = (likes: number) => {
    // Calcul de la tendance basé sur le nombre de likes
    const trendValue = Math.min(Math.floor((likes / 100) * 100), 99);
    return {
      value: trendValue,
      icon: trendValue > 50 ? 'pi pi-arrow-up' : 'pi pi-arrow-down',
      color: trendValue > 50 ? 'text-green-500' : 'text-red-500'
    };
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <i className="pi pi-star-fill mr-3 text-amber-500"></i>
          Tendances du moment
        </h3>
        {popularProducts.length > 0 && (
          <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
            {popularProducts.length} produits
          </span>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="bg-gray-200 rounded-lg w-14 h-14 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-center">
            <i className="pi pi-exclamation-triangle text-red-500 mr-3"></i>
            <p className="text-red-600">{error}</p>
          </div>
        ) : popularProducts.length === 0 ? (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
            <p className="text-blue-600">Aucune tendance pour le moment</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {popularProducts.map((product) => (
              <motion.li 
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="py-3"
              >
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedProduct(expandedProduct === product._id ? null : product._id)}
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  <div className="flex-1 min-w-0"> 
                    {product.isNew && (
                      <span className=" bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                        Nouveau
                      </span>
                    )}
                    <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{product.category}</span>
                      <span className="flex items-center text-xs text-red-500">
                        <i className="pi pi-heart-fill mr-1"></i>
                        {product.likes}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${calculateTrend(product.likes).color}`}>
                      {calculateTrend(product.likes).value}%
                    </span>
                    <i className={`pi ${calculateTrend(product.likes).icon} ${calculateTrend(product.likes).color}`}></i>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedProduct === product._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 pl-17"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 font-bold">
                          {product.price.toLocaleString()} FCFA
                        </span>
                        <button 
                          className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Ajouter au panier
                          }}
                        >
                          Voir le produit
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {!loading && popularProducts.length > 0 && (
        <div className="mt-6 text-center">
          <button className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center justify-center gap-2 mx-auto">
            Voir toutes les tendances
            <i className="pi pi-arrow-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}