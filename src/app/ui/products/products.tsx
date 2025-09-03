'use client'

import ProductsCards from "../productcard/productsCard";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/app/types";

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    const savedLikes = localStorage.getItem("likedProducts");
    if (savedLikes) {
      setLikedProducts(JSON.parse(savedLikes));
    }

    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`); 
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    }
    fetchData();
  }, []);

  // Fonction de gestion des likes
  const handleLike = async (productId: string) => {
    try {
      const alreadyLiked = likedProducts.includes(productId);
      
      // Met à jour les likes dans le state local
      const newLikedProducts = alreadyLiked
        ? likedProducts.filter((id) => id !== productId)
        : [...likedProducts, productId];
      setLikedProducts(newLikedProducts);
      localStorage.setItem("likedProducts", JSON.stringify(newLikedProducts));

      // Met à jour les produits localement (optimisation de l'affichage)
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? { ...p, likes: (p.likes ?? 0) + (alreadyLiked ? -1 : 1) }
            : p
        )
      );

      // Appel API pour mise à jour BDD (avec la bonne URL)
      await fetch(`${API_BASE_URL}/products/${productId}/toggle-like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ like: !alreadyLiked }), // on envoie un booléen
      });
      
    } catch (error) {
      console.error("Erreur lors du like :", error);
      
    }
  };

  return (
    <section id="products" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-green-900">
          Nos Collections
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {`Découvrez nos gammes de meubles préfabriqués qui s'adapteront parfaitement à votre intérieur.`}
        </p>
        <ProductsCards products={products} onLike={handleLike} />
        <div className="text-center mt-12">
          <Link href="../../ui/catalogue">
            <button className="border-2 border-green-800 text-green-800 px-6 py-3 rounded-lg font-medium hover:bg-green-800 hover:text-white transition">
              Voir tout le catalogue
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}