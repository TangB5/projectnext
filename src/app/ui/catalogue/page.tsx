'use client';

import { useEffect, useState, useCallback,useReducer } from 'react';
import toast from 'react-hot-toast';
import { Frown, Smile, Home, Filter, Loader2, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {Product} from "@/app/types";
import { motion, AnimatePresence } from 'framer-motion';
import { useProductApi } from '@/app/hooks/useProductApi';
import  {useAuth}  from "@/app/lib/authProvider";
import ProductCard from '../component/productcard/productCard';
import { productsReducer, initialState } from "../component/productcard/productsReducer";
import LoginModal from "../component/modals/LoginModal";
import ConfirmOrderModal from "../component/modals/ConfirmOrderModal";
import SuccessModal from "../component/modals/SuccessModal";
import ErrorModal from "../component/modals/ErrorModal";
import {createOrder, getProducts} from "@/app/lib/apiHelpers";


interface FilterButtonProps {
  category: string;
  activeFilter: string;
  onClick: (category: string) => void;
  isMobile?: boolean;
}

const FilterButton = ({ category, activeFilter, onClick, isMobile = false }: FilterButtonProps) => (
  <motion.button
    key={category}
    onClick={() => onClick(category)}
    whileTap={{ scale: 0.95 }}
    className={`px-4 py-3 rounded-lg font-medium transition-all ${activeFilter === category
        ? isMobile
          ? 'bg-emerald-800 text-white shadow-md'
          : 'bg-white text-emerald-800 shadow-md font-semibold'
        : isMobile
          ? 'bg-gray-100 hover:bg-emerald-700 hover:text-white hover:shadow-sm'
          : 'hover:bg-gray-200 hover:text-emerald-700'
      }`}
  >
    {category}
  </motion.button>
);

// Composant pour l'état de chargement
const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center h-96 w-full"
  >
    <Loader2 className="w-12 h-12 text-emerald-700 animate-spin mb-6" />
    <p className="text-emerald-800 font-medium text-lg">Chargement des produits...</p>
  </motion.div>
);

// Composant pour l'état vide
const NoProductsMessage = ({ onResetFilter }: { onResetFilter: () => void }) => (
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
        onClick={onResetFilter}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-xl transition-all shadow-md"
      >
        <Smile className="w-5 h-5" />
        <span>Voir tous les produits</span>
      </motion.button>
    </div>
  </motion.div>
);

export default function Catalogue() {

  const router = useRouter();
  const [state, dispatch] = useReducer(productsReducer, initialState);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState('Tous');
  const {  isAuthenticated, loading,session } = useAuth();
  const user = session?.user;
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const {  toggleProductLike } = useProductApi();
  


   useEffect(() => {
  const initializeData = async () => {
    const savedLikes = localStorage.getItem('likedProducts');
    if (savedLikes) {
      setLikedProducts(JSON.parse(savedLikes));
    }

    dispatch({ type: 'FETCH_PRODUCTS_REQUEST' });
    try {
      const products = await getProducts();
      dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: products });
      setAllProducts(products);
      setFilteredProducts(products);
    } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erreur inconnue";
        dispatch({ type: "FETCH_PRODUCTS_FAILURE", payload: message });
      }
    };

  initializeData();
}, []);


  const handleLike = useCallback(async (productId: string) => {
    try {
      const alreadyLiked = likedProducts.includes(productId);

      const newLikedProducts = alreadyLiked
        ? likedProducts.filter(id => id !== productId)
        : [...likedProducts, productId];

      setLikedProducts(newLikedProducts);
      localStorage.setItem('likedProducts', JSON.stringify(newLikedProducts));

      const updatedProduct = await toggleProductLike(productId, !alreadyLiked);

      // Mise à jour des produits avec les données fraîches du serveur
      setAllProducts(prev => prev.map(p => p._id === productId ? updatedProduct : p));
      setFilteredProducts(prev => prev.map(p => p._id === productId ? updatedProduct : p));

      // Notification de succès
      toast.success(
        alreadyLiked ? 'Produit retiré de vos favoris' : 'Produit ajouté aux favoris',
        {
          icon: alreadyLiked ? '❌' : '❤️',
          style: { borderRadius: '10px', background: '#333', color: '#fff' },
        }
      );
    } catch (error) {
      console.error('Erreur lors du like :', error);

      // Rollback en cas d'erreur - recharge les likes depuis le localStorage
      const savedLikes = localStorage.getItem('likedProducts');
      if (savedLikes) {
        setLikedProducts(JSON.parse(savedLikes));
      }

      toast.error('Erreur lors de la mise à jour des likes.');
    }
  }, [likedProducts, toggleProductLike]); // Maintenant avec la bonne dépendance

  const handleFilter = useCallback((category: string) => {
    setActiveFilter(category);

    if (category === 'Tous') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }

    setMobileFiltersOpen(false);
  }, [allProducts]);

  // Recherche de produits
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      handleFilter(activeFilter);
      return;
    }

    const searchResults = allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(searchResults);
  }, [allProducts, activeFilter, handleFilter]);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilter('Tous');
    setFilteredProducts(allProducts);
  }, [allProducts]);

  const goToHome = () => {
    router.push('/');
  };
    const handleOrder = useCallback(
        (product: Product) => {
            dispatch({ type: "SELECT_PRODUCT", payload: product });
            if (!isAuthenticated) {
                dispatch({ type: "SHOW_LOGIN_MODAL" });
            } else {
                dispatch({ type: "SHOW_CONFIRM_MODAL" });
            }
        },
        [isAuthenticated]
    );

    // Confirmation de commande
    const userIdToSend = session?.user?.id;

    const confirmOrder = async ({
                                    address,
                                    phone,
                                    paymentMethod,
                                }: {
        address: string;
        phone: string;
        paymentMethod: string;
    }) => {
        if (!state.selectedProduct || !user) return;

        dispatch({ type: "ORDER_REQUEST" });

        try {

            const items = [
                {
                    productId: state.selectedProduct._id,
                    quantity: state.quantity,
                    price: state.selectedProduct.price,
                },
            ];

            const orderDetails = {
                address: address?.trim() || "",
                phone: phone?.trim() || "",
            };

            await createOrder(
                userIdToSend!,
                items,
                paymentMethod?.trim() || "non précisé",
                orderDetails
            );

            dispatch({
                type: "ORDER_SUCCESS",
                payload: `Votre commande de ${state.quantity} x ${state.selectedProduct.name} a été enregistrée !`,
            });


            setAddress("");
            setPhone("");
            setPaymentMethod("");
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Erreur lors de la commande";
            dispatch({ type: "ORDER_FAILURE", payload: message });
        }
    };





    const categories = ['Tous', 'Salon', 'Cuisine', 'Chambre', 'Bureau', 'Extérieur'];
  const handleCloseLoginModal = () => dispatch({ type: 'HIDE_LOGIN_MODAL' });
  const handleCloseConfirmModal = () => dispatch({ type: 'HIDE_CONFIRM_MODAL' });
  const handleCloseSuccessModal = () => dispatch({ type: 'HIDE_SUCCESS_MODAL' });
  const handleCloseErrorModal = () => dispatch({ type: 'HIDE_ERROR_MODAL' });
  const handleQuantityChange = (qty: number) => dispatch({ type: 'SET_QUANTITY', payload: qty });

  

  return (
    <section className="py-12 bg-gradient-to-b from-emerald-50 to-white min-h-screen md:pt-40 pt-20">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
        >
          <div className="w-full justify-center flex items-center gap-4">
            <motion.button
              onClick={goToHome}
              whileHover={{ x: -3 }}
              className="flex items-center gap-2 text-emerald-800 hover:text-emerald-700 transition-colors"
            >
              <Home className="w-6 h-6" />
              <span className="text-lg font-medium">Accueil</span>
            </motion.button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="md:text-4xl font-bold text-emerald-900 font-serif text-xl">
              Catalogue complet
            </h1>
          </div>

          {/* Bouton filtre mobile */}
          <button
            type="button"
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <Filter className="w-5 h-5" />
            <span>Filtres</span>
          </button>
        </motion.div>

        {/* Barre de recherche */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8 max-w-2xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filtres mobiles */}
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
                  <FilterButton
                    key={cat}
                    category={cat}
                    activeFilter={activeFilter}
                    onClick={handleFilter}
                    isMobile={true}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtres desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex justify-center mb-12"
        >
          <div className="inline-flex rounded-xl bg-gray-100 p-1 shadow-inner">
            {categories.map((cat) => (
              <FilterButton
                key={cat}
                category={cat}
                activeFilter={activeFilter}
                onClick={handleFilter}
              />
            ))}
          </div>
        </motion.div>

        {/* Indicateur de filtre actif */}
        {(activeFilter !== 'Tous' || searchQuery) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center items-center mb-8 gap-4"
          >
            <span className="text-gray-600">
              Filtre actif:
              <span className="font-semibold text-emerald-700 ml-2">
                {activeFilter !== 'Tous' ? activeFilter : 'Recherche: ' + searchQuery}
              </span>
            </span>
            <button
              onClick={resetFilters}
              className="text-sm text-emerald-700 hover:text-emerald-800 underline flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Effacer les filtres
            </button>
          </motion.div>
        )}

        {/* Contenu principal */}
        {loading ? (
          <LoadingState />
        ) : filteredProducts.length === 0 ? (
          <NoProductsMessage onResetFilter={resetFilters} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onLike={handleLike}
                onOrder={handleOrder}
                isLiked={likedProducts.includes(product._id)}
              />
            ))}
            {/* Modals */}
            <LoginModal isOpen={state.showLoginModal} product={state.selectedProduct} onClose={handleCloseLoginModal} />
              <ConfirmOrderModal
                  isOpen={state.showConfirmModal}
                  product={state.selectedProduct}
                  quantity={state.quantity}
                  onQuantityChange={handleQuantityChange}
                  onClose={handleCloseConfirmModal}
                  onConfirm={confirmOrder}
                  isOrdering={state.isOrdering}
                  address={address}
                  onAddressChange={setAddress}
                  phone={phone}
                  onPhoneChange={setPhone}
                  paymentMethod={paymentMethod}
                  onPaymentChange={setPaymentMethod}
              />
            <SuccessModal isOpen={state.showSuccessModal} message={state.successMessage} onClose={handleCloseSuccessModal} />
            <ErrorModal isOpen={state.showErrorModal} message={state.errorMessage} onClose={handleCloseErrorModal} />

          </motion.div>
        )}
      </div>
    </section>
  );
}