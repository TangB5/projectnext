"use client";

import { useEffect, useReducer, useCallback, useMemo, useState } from "react";
import { Product, OrderRequest } from "@/app/types";
import ProductCard from "./productCard";
import ProductLoading from "./ProductLoading";
import ProductEmptyState from "./ProductEmptyState";
import LoginModal from "../modals/LoginModal";
import ConfirmOrderModal from "../modals/ConfirmOrderModal";
import SuccessModal from "../modals/SuccessModal";
import ErrorModal from "../modals/ErrorModal";
import { useAuth } from "@/app/lib/authProvider";
import { useApi } from "@/app/hooks/useApi";
import { productsReducer, initialState } from "./productsReducer";
import Link from "next/link";
import { useProductApi } from "@/app/hooks/useProductApi";
import toast from "react-hot-toast";
import { Heart, XCircle } from "lucide-react";

export default function ProductsCards() {
    const [state, dispatch] = useReducer(productsReducer, initialState);
    const { user, isAuthenticated, loading } = useAuth();
    const { fetchProducts, createOrder } = useApi();
    const { toggleProductLike } = useProductApi();

    // Nouveaux états pour la commande
    const [likedProducts, setLikedProducts] = useState<string[]>([]);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    const memoizedProducts = useMemo(() => state.products, [state.products]);

    // Initialisation des produits
    useEffect(() => {
        const initializeData = async () => {
            const savedLikes = localStorage.getItem("likedProducts");
            if (savedLikes) setLikedProducts(JSON.parse(savedLikes));

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

                const updatedProduct = await toggleProductLike(productId, !alreadyLiked);
                dispatch({ type: "UPDATE_PRODUCT", payload: updatedProduct });

                toast.success(
                    alreadyLiked
                        ? "Produit retiré de vos favoris"
                        : "Produit ajouté aux favoris",
                    {
                        icon: alreadyLiked ? (
                            <XCircle className="text-red-500" />
                        ) : (
                            <Heart className="text-rose-500" />
                        ),
                        style: {
                            borderRadius: "10px",
                            background: "#333",
                            color: "#fff",
                        },
                    }
                );
            } catch (error) {
                console.error("Erreur lors du like :", error);
                toast.error("Erreur lors de la mise à jour des favoris.");
            }
        },
        [likedProducts, toggleProductLike]
    );

    // Commande d’un produit
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
            const orderRequest: OrderRequest = {
                userId: user?._id ?? "",
                items: [
                    {
                        productId: state.selectedProduct._id,
                        quantity: state.quantity,
                        price: state.selectedProduct.price,
                    },
                ],
                totalAmount: state.selectedProduct.price * state.quantity,
                paymentMethod: paymentMethod?.trim() || "non précisé",
                details: {
                    address: address?.trim() || "",
                    phone: phone?.trim() || "",
                },
            };

            await createOrder(orderRequest);

            dispatch({
                type: "ORDER_SUCCESS",
                payload: `Votre commande de ${state.quantity} x ${state.selectedProduct.name} a été enregistrée !`,
            });

            // Réinitialise les champs
            setAddress("");
            setPhone("");
            setPaymentMethod("");
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Erreur lors de la commande";
            dispatch({ type: "ORDER_FAILURE", payload: message });
        }
    };

    // Gestion des modaux
    const handleCloseLoginModal = () => dispatch({ type: "HIDE_LOGIN_MODAL" });
    const handleCloseConfirmModal = () => dispatch({ type: "HIDE_CONFIRM_MODAL" });
    const handleCloseSuccessModal = () => dispatch({ type: "HIDE_SUCCESS_MODAL" });
    const handleCloseErrorModal = () => dispatch({ type: "HIDE_ERROR_MODAL" });
    const handleQuantityChange = (qty: number) =>
        dispatch({ type: "SET_QUANTITY", payload: qty });

    // États de chargement / vide
    if (state.loading) return <ProductLoading />;
    if (!state.products.length) return <ProductEmptyState />;

    return (
        <div className="mt-40" id="products">
            <div className="relative py-16 px-6 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden">
                {/* Éléments décoratifs */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-gray-200 rounded-full opacity-40 blur-xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gray-300 rounded-full opacity-30 blur-xl"></div>

                <div className="relative max-w-7xl mx-auto">
                    {/* En-tête */}
                    <div className="text-center mb-6">
                        {loading ? (
                            <p className="text-gray-500">Vérification de votre session...</p>
                        ) : (
                            <p className="text-gray-600">
                                Connectez-vous pour commander vos produits
                            </p>
                        )}
                    </div>

                    {/* Titre */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center mb-4">
                            <div className="w-3 h-3 bg-emerald-600 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                Notre Collection
              </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Découvrez nos{" "}
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

            {/* Liste des produits */}
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

                {/* Modaux */}
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
                    address={address}
                    onAddressChange={setAddress}
                    phone={phone}
                    onPhoneChange={setPhone}
                    paymentMethod={paymentMethod}
                    onPaymentChange={setPaymentMethod}
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
