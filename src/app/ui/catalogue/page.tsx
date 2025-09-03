'use client';

import { useEffect, useState } from 'react';
import ProductsCards from '../productcard/productsCard';
import toast from 'react-hot-toast';
import { Frown, Smile, Home, Filter, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product } from '@/app/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function Catalogue() {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    const savedLikes = localStorage.getItem('likedProducts');
    if (savedLikes) {
      setLikedProducts(JSON.parse(savedLikes));
    }

    const fetchProducts = async () => {
      try {
        // CORRECTION DE L'URL
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des produits');
        }
        const data: Product[] = await res.json();
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error(error);
        toast.error('Erreur lors du chargement du catalogue');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleLike = async (productId: string) => {
  try {
    const alreadyLiked = likedProducts.includes(productId);

    // MAJ optimiste du stockage local utilisateur
    const newLikedProducts = alreadyLiked
      ? likedProducts.filter((id) => id !== productId)
      : [...likedProducts, productId];
    setLikedProducts(newLikedProducts);
    localStorage.setItem("likedProducts", JSON.stringify(newLikedProducts));

    // Appel API (persistance dans la BDD)
    const res = await fetch(`${API_BASE_URL}/api/products/${productId}/toggle-like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ like: !alreadyLiked }),
    });

    if (!res.ok) {
      throw new Error("Échec de la mise à jour des likes sur le serveur");
    }

    const { product: updatedProduct } = await res.json();

    // MAJ des produits avec la valeur retournée par le serveur
    setAllProducts((prev) =>
      prev.map((p) => (p._id === productId ? updatedProduct : p))
    );
    setFilteredProducts((prev) =>
      prev.map((p) => (p._id === productId ? updatedProduct : p))
    );

    toast.success(
      alreadyLiked
        ? "Produit retiré de vos favoris"
        : "Produit ajouté aux favoris",
      {
        icon: alreadyLiked ? "❌" : "❤️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      }
    );
  } catch (error) {
    console.error("Erreur lors du like :", error);
    toast.error("Erreur lors de la mise à jour des likes.");

    // En cas d'erreur, rollback du localStorage
    const alreadyLiked = likedProducts.includes(productId);
    const rollbackLikes = alreadyLiked
      ? [...likedProducts, productId]
      : likedProducts.filter((id) => id !== productId);

    setLikedProducts(rollbackLikes);
    localStorage.setItem("likedProducts", JSON.stringify(rollbackLikes));
  }
};

  const handleFilter = (category: string) => {
    setActiveFilter(category);
    if (category === 'Tous') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
    setMobileFiltersOpen(false);
  };

  const goToHome = () => {
    router.push('/');
  };

  const NoProductsMessage = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm"
    >
      <Frown className="w-16 h-16 text-gray-400 mb-6" />
      <h3 className="text-3xl font-bold text-gray-800 mb-4">Aucun produit disponible</h3>
      <p className="text-gray-600 mb-8 max-w-md text-lg leading-relaxed">
        Nous n&rsquo;avons trouvé aucun produit correspondant à cette catégorie.
        <br />
        Explorez nos autres collections ou revenez plus tard !
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <motion.button 
          onClick={() => handleFilter('Tous')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-xl transition-all shadow-md"
        >
          <Smile className="w-5 h-5" />
          <span>Voir tous les produits</span>
        </motion.button>
      </div>
    </motion.div>
  );

  const categories = ['Tous', 'Salon', 'Cuisine', 'Chambre', 'Bureau', 'Extérieur'];

  return (
    <section className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
        >
          <div className="flex items-center gap-4">
            <motion.button 
              onClick={goToHome}
              whileHover={{ x: -3 }}
              className="flex items-center gap-2 text-green-800 hover:text-green-700 transition-colors"
            >
              <Home className="w-6 h-6" />
              <span className="text-lg font-medium">Accueil</span>
            </motion.button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-4xl font-bold text-green-900 font-serif">
              Catalogue complet
            </h1>
          </div>
          <button
            type="button"
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <Filter className="w-5 h-5" />
            <span>Filtres</span>
          </button>
        </motion.div>

        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mb-8 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    onClick={() => handleFilter(cat)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      activeFilter === cat
                        ? 'bg-green-800 text-white shadow-md'
                        : 'bg-gray-100 hover:bg-green-700 hover:text-white hover:shadow-sm'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex justify-center mb-12"
        >
          <div className="inline-flex rounded-xl bg-gray-100 p-1 shadow-inner">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeFilter === cat
                    ? 'bg-white text-green-800 shadow-md font-semibold'
                    : 'hover:bg-gray-200 hover:text-green-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-96 w-full"
          >
            <Loader2 className="w-12 h-12 text-green-700 animate-spin mb-6" />
            <p className="text-green-800 font-medium text-lg">Chargement des produits...</p>
          </motion.div>
        ) : filteredProducts.length === 0 ? (
          <NoProductsMessage />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }} 
          >
            <ProductsCards
              products={filteredProducts}
              onLike={handleLike}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}