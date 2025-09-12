"use client";

import { useEffect, useReducer, useCallback, useMemo, useState } from "react";
import { Product, OrderItem } from "@/app/types";
import ProductCard from "./productCard";
import ProductLoading from "./ProductLoading";
import ProductEmptyState from "./ProductEmptyState";
import LoginModal from "../modals/LoginModal";
import ConfirmOrderModal from "../modals/ConfirmOrderModal";
import SuccessModal from "../modals/SuccessModal";
import ErrorModal from "../modals/ErrorModal";
import {useAuth}  from "@/app/lib/authProvider";
import { useApi } from "@/app/hooks/useApi";
import { productsReducer, initialState } from "./productsReducer";
import Link from "next/link";
import { useProductApi } from "@/app/hooks/useProductApi";
import toast from "react-hot-toast";

export default function ProductsCards() {
  const [state, dispatch] = useReducer(productsReducer, initialState);
  const {  isAuthenticated, loading } = useAuth(); 
  const { fetchProducts, createOrder } = useApi();
  const { toggleProductLike } = useProductApi();
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  const memoizedProducts = useMemo(() => state.products, [state.products]);

  useEffect(() => {
    const initializeData = async () => {
      const savedLikes = localStorage.getItem("likedProducts");
      if (savedLikes) {
        setLikedProducts(JSON.parse(savedLikes));
      }

      dispatch({ type: "FETCH_PRODUCTS_REQUEST" });
      try {
        const products = await fetchProducts();
        dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: products });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erreur inconnue";
        dispatch({ type: "FETCH_PRODUCTS_FAILURE", payload: message });
      }
    };

    initializeData();
  }, [fetchProducts]);

  // Gestion des likes
  const handleLike = useCallback(
    async (productId: string) => {
      try {
        const alreadyLiked = likedProducts.includes(productId);

        const newLikedProducts = alreadyLiked
          ? likedProducts.filter((id) => id !== productId)
          : [...likedProducts, productId];

        setLikedProducts(newLikedProducts);
        localStorage.setItem("likedProducts", JSON.stringify(newLikedProducts));

        const updatedProduct = await toggleProductLike(
          productId,
          !alreadyLiked
        );

        dispatch({ type: "UPDATE_PRODUCT", payload: updatedProduct });

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

        // Rollback en cas d'erreur
        const rollbackLikes = likedProducts.includes(productId)
          ? likedProducts.filter((id) => id !== productId)
          : [...likedProducts, productId];

        setLikedProducts(rollbackLikes);
        localStorage.setItem("likedProducts", JSON.stringify(rollbackLikes));
      }
    },
    [likedProducts, toggleProductLike]
  );

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

  const confirmOrder = async () => {
    if (!state.selectedProduct) return;

    dispatch({ type: "ORDER_REQUEST" });

    try {
      const orderItem: OrderItem = {
        productId: state.selectedProduct._id,
        quantity: state.quantity,
        price: state.selectedProduct.price,
      };

      await createOrder([orderItem]);

      dispatch({
        type: "ORDER_SUCCESS",
        payload: `Votre commande de ${state.quantity} x ${state.selectedProduct.name} a été enregistrée 🎉`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur lors de la commande";
      dispatch({ type: "ORDER_FAILURE", payload: message });
    }
  };

  // Gestionnaires d'événements modaux
  const handleCloseLoginModal = () => dispatch({ type: "HIDE_LOGIN_MODAL" });
  const handleCloseConfirmModal = () => dispatch({ type: "HIDE_CONFIRM_MODAL" });
  const handleCloseSuccessModal = () => dispatch({ type: "HIDE_SUCCESS_MODAL" });
  const handleCloseErrorModal = () => dispatch({ type: "HIDE_ERROR_MODAL" });
  const handleQuantityChange = (qty: number) =>
    dispatch({ type: "SET_QUANTITY", payload: qty });

  // États de chargement et données vides
  if (state.loading) return <ProductLoading />;
  if (!state.products.length) return <ProductEmptyState />;

  return (
    <div className="mt-40" id="products">
      <div className="relative py-16 px-6 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gray-200 rounded-full opacity-40 blur-xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gray-300 rounded-full opacity-30 blur-xl"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* ✅ En-tête avec auth */}
          <div className="text-center mb-6">
            {loading ? (
              <p className="text-gray-500">Vérification de votre session...</p>
            ) : (
              <p className="text-gray-600">
                Connectez-vous pour commander vos produits
              </p>
            )}
          </div>

          {/* En-tête principal */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-3 h-3 bg-emerald-600 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                Notre Collection
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Découvrez nos
              <span className="relative ml-3">
                produits
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-emerald-500"
                  viewBox="0 0 200 20"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,10 C50,5 100,15 200,10"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Explorez notre sélection exclusive de produits soigneusement conçus
              pour répondre à tous vos besoins avec qualité et élégance.
            </p>
          </div>

          {/* Indicateurs de stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 text-center transition-all hover:shadow-md hover:-translate-y-1 hover:bg-emerald-50">
              <div className="text-3xl font-bold text-emerald-700 mb-2">
                150+
              </div>
              <div className="text-gray-600">Produits uniques</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 text-center transition-all hover:shadow-md hover:-translate-y-1 hover:bg-emerald-50">
              <div className="text-3xl font-bold text-emerald-700 mb-2">
                98%
              </div>
              <div className="text-gray-600">Satisfaction clients</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 text-center transition-all hover:shadow-md hover:-translate-y-1 hover:bg-emerald-50">
              <div className="text-3xl font-bold text-emerald-700 mb-2">
                24h
              </div>
              <div className="text-gray-600">Livraison express</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 text-center transition-all hover:shadow-md hover:-translate-y-1 hover:bg-emerald-50">
              <div className="text-3xl font-bold text-emerald-700 mb-2">
                5★
              </div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
          </div>

          {/* Bouton catalogue */}
          <div className="text-center">
            <Link
              href="../../ui/catalogue"
              className="inline-flex items-center px-8 py-4 bg-emerald-700 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-800 transition-colors duration-300 transform hover:-translate-y-1"
            >
              Explorer tous les produits
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {memoizedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onOrder={handleOrder}
            onLike={handleLike}
            isLiked={likedProducts.includes(product._id)}
          />
        ))}

        {/* Modals */}
        <LoginModal
          isOpen={state.showLoginModal}
          product={state.selectedProduct}
          onClose={handleCloseLoginModal}
        />
        <ConfirmOrderModal
          isOpen={state.showConfirmModal}
          product={state.selectedProduct}
          quantity={state.quantity}
          onQuantityChange={handleQuantityChange}
          onClose={handleCloseConfirmModal}
          onConfirm={confirmOrder}
          isOrdering={state.isOrdering}
        />
        <SuccessModal
          isOpen={state.showSuccessModal}
          message={state.successMessage}
          onClose={handleCloseSuccessModal}
        />
        <ErrorModal
          isOpen={state.showErrorModal}
          message={state.errorMessage}
          onClose={handleCloseErrorModal}
        />
      </div>
    </div>
  );
}
