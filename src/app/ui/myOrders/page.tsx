"use client";

import {useState, useEffect, useCallback, JSX} from "react";
import { useAuth } from "@/app/lib/authProvider";
import toast from "react-hot-toast";
import Image from "next/image";
import {
    FaShoppingBag,
    FaFilter,
    FaSearch,
    FaTruck,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaCog,
    FaBoxOpen,
    FaChevronLeft,
    FaChevronRight,
    FaEye,
    FaDownload,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaCreditCard,
    FaQuestionCircle,
    FaExclamationTriangle,

    FaUser
} from 'react-icons/fa';

// Types basés sur vos interfaces
interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
}

interface OrderItem {
    productId: {
        _id: string;
        name: string;
        price: number;
        images: string[];
        slug: string;
        category: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    userId: User;
    items: OrderItem[];
    totalAmount: number;
    status: 'En attente' | 'En traitement' | 'Expédiée' | 'Annulée';
    createdAt: string;
    paymentMethod?: string;
    details?: {
        address?: string;
        trackingNumber?: string;
        estimatedDelivery?: string;
    };
}

// Composant Skeleton avec animation
const OrderCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
        <div className="p-6">
            <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: Order["status"] }) => {
    const statusConfig: Record<string, { class: string; icon: JSX.Element; label: string }> = {
        'En attente': {
            class: "bg-amber-50 text-amber-800 border-amber-200",
            icon: <FaClock className="text-amber-600" />,
            label: "En attente",
        },
        'En traitement': {
            class: "bg-blue-50 text-blue-800 border-blue-200",
            icon: <FaCog className="text-blue-600 animate-spin" />,
            label: "En traitement",
        },
        'Expédiée': {
            class: "bg-purple-50 text-purple-800 border-purple-200",
            icon: <FaTruck className="text-purple-600" />,
            label: "Expédiée",
        },
        'Annulée': {
            class: "bg-red-50 text-red-800 border-red-200",
            icon: <FaTimesCircle className="text-red-600" />,
            label: "Annulée",
        },
    };


    const config = statusConfig[status] || {
        class: "bg-gray-100 text-gray-700 border-gray-200",
        icon: <FaQuestionCircle className="text-gray-500" />,
        label: status || "Inconnu",
    };

    return (
        <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${config.class}`}
        >
      {config.icon}
            {config.label}
    </span>
    );
};


// Barre de progression du statut
const OrderProgress = ({ status }: { status: Order["status"] }) => {
    const steps = [
        { key: 'En attente', label: "Confirmée", icon: <FaCheckCircle /> },
        { key: 'En traitement', label: "Préparation", icon: <FaCog /> },
        { key: 'Expédiée', label: "Expédiée", icon: <FaTruck /> }
    ];

    const currentIndex = steps.findIndex(step => step.key === status);

    if (status === 'Annulée') return null;

    return (
        <div className="flex items-center justify-between mb-6 px-4">
            {steps.map((step, index) => (
                <div key={step.key} className="flex items-center flex-1">
                    <div className={`flex flex-col items-center ${index <= currentIndex ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 border-2 transition-all duration-300 ${
                            index <= currentIndex
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-white text-gray-500 border-gray-300'
                        }`}>
                            {step.icon}
                        </div>
                        <span className="text-xs text-center font-medium hidden sm:block">{step.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 transition-all duration-500 ${
                            index < currentIndex ? 'bg-green-600' : 'bg-gray-200'
                        }`} />
                    )}
                </div>
            ))}
        </div>
    );
};

// Composant d'item de produit avec image
const OrderItem = ({ item }: { item: OrderItem }) => (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
        <div className="relative w-16 h-16 flex-shrink-0">
            <Image
                src={item.productId.images?.[0] || "/images/placeholder-product.jpg"}
                alt={item.productId.name}
                fill
                className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="64px"
            />
            {item.quantity > 1 && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {item.quantity}
                </div>
            )}
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{item.productId.name}</h4>
            <p className="text-sm text-gray-600 capitalize">{item.productId.category}</p>
            <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-bold text-green-600">
          {(item.price * item.quantity).toFixed(2)} fcfa
        </span>
                <span className="text-sm text-gray-500">{item.price.toFixed(2)} {`fcfa l'unité`}</span>
            </div>
        </div>
    </div>
);

// Carte de commande principale
const OrderCard = ({ order }: { order: Order }) => {
    const [expanded, setExpanded] = useState(false);

    const getOrderNumber = (orderId: string) => {
        return orderId.slice(-8).toUpperCase();
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden ">
            {/* En-tête de la commande */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="space-y-3 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FaShoppingBag className="text-green-500" />
                                Commande #{getOrderNumber(order._id)}
                            </h3>
                            <StatusBadge status={order.status} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-gray-400 text-xs" />
                                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCreditCard className="text-gray-400 text-xs" />
                                {order.paymentMethod || "Non précisé"}
                            </div>
                            {order.details?.trackingNumber && (
                                <div className="flex items-center gap-2">
                                    <FaTruck className="text-gray-400 text-xs" />
                                    Suivi: {order.details.trackingNumber}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 mb-1">
                            {order.totalAmount.toFixed(2)} fcfa
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 justify-end">
                            <FaBoxOpen className="text-xs" />
                            {order.items.length} article{order.items.length > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>

            {/* Barre de progression */}
            {order.status !== 'Annulée' && (
                <div className="px-6 pt-4">
                    <OrderProgress status={order.status} />
                </div>
            )}

            {/* Contenu de la commande */}
            <div className="p-6">
                <div className="grid gap-4">
                    {order.items.slice(0, expanded ? undefined : 3).map((item, index) => (
                        <OrderItem key={`${item.productId._id}-${index}`} item={item} />
                    ))}
                </div>

                {/* Bouton voir plus/moins */}
                {order.items.length > 3 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mt-4 mx-auto transition-colors"
                    >
                        {expanded ? "Réduire" : `Voir les ${order.items.length - 3} articles supplémentaires`}
                        <FaEye className="text-sm" />
                    </button>
                )}

                {/* Informations supplémentaires */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex justify-between items-center w-full text-left hover:bg-gray-50 p-3 rounded-xl transition-colors"
                    >
            <span className="font-semibold text-gray-900 flex items-center gap-2">
              <FaSearch className="text-gray-400" />
              Informations supplémentaires
            </span>
                        <FaChevronRight className={`text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
                    </button>

                    {expanded && (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {order.details?.address && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-green-500" />
                                        Adresse de livraison
                                    </h5>
                                    <div className="text-sm text-gray-600">
                                        <p>{order.details.address}</p>
                                    </div>
                                </div>
                            )}

                            {order.details?.estimatedDelivery && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <FaTruck className="text-blue-500" />
                                        Livraison estimée
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.details.estimatedDelivery).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </p>
                                </div>
                            )}

                            {/* Informations client */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <FaUser className="text-purple-500" />
                                    Informations client
                                </h5>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>{order.userId.name}</p>
                                    <p>{order.userId.email}</p>
                                    {order.userId.phone && <p>{order.userId.phone}</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
                    <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium">
                        <FaEye />
                        Voir les détails
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                        <FaDownload />
                        Télécharger la facture
                    </button>
                    {order.status === 'Expédiée' && order.details?.trackingNumber && (
                        <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium">
                            <FaTruck />
                            Suivre le colis
                        </button>
                    )}
                    {order.status === 'En attente' && (
                        <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                            <FaTimesCircle />
                            Annuler la commande
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Filtres avec compteurs
const OrderFilters = ({
                          currentFilter,
                          onFilterChange,
                          statusCounts
                      }: {
    currentFilter: string;
    onFilterChange: (filter: string) => void;
    statusCounts: Record<string, number>;
}) => {
    const filters = [
        { key: "all", label: "Toutes les commandes", icon: <FaShoppingBag />, count: statusCounts.all },
        { key: "En attente", label: "En attente", icon: <FaClock />, count: statusCounts['En attente'] },
        { key: "En traitement", label: "En traitement", icon: <FaCog />, count: statusCounts['En traitement'] },
        { key: "Expédiée", label: "Expédiées", icon: <FaTruck />, count: statusCounts['Expédiée'] },
        { key: "Annulée", label: "Annulées", icon: <FaTimesCircle />, count: statusCounts['Annulée'] },
    ];

    return (
        <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
                <button
                    key={filter.key}
                    onClick={() => onFilterChange(filter.key)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                        currentFilter === filter.key
                            ? "bg-green-600 text-white shadow-lg shadow-green-200 border-green-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                    }`}
                >
                    <span className="text-lg">{filter.icon}</span>
                    {filter.label}
                    {filter.count > 0 && (
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                            currentFilter === filter.key
                                ? "bg-white text-green-600"
                                : "bg-green-100 text-green-600"
                        }`}>
              {filter.count}
            </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default function MyOrdersPage() {
    const { session, isAuthenticated, loading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalOrders, setTotalOrders] = useState(0);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
    const [searchTerm, setSearchTerm] = useState("");

    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchOrders = useCallback(async () => {
        if (!isAuthenticated || !session?.user?.id) return;

        setLoadingOrders(true);
        try {
            let url = `${API_BASE_URL}api/orders?userId=${session.user.id}&page=${page}&limit=${limit}`;
            if (statusFilter !== "all") {
                url += `&status=${encodeURIComponent(statusFilter)}`;
            }
            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }

            const res = await fetch(url, {
                credentials: "include",
                headers: {
                    'Cache-Control': 'no-cache',
                }
            });

            if (!res.ok) throw new Error("Erreur lors de la récupération des commandes");

            const data = await res.json();
            setOrders(data.orders || []);
            setTotalOrders(data.total || 0);
            setStatusCounts(data.statusCounts || {});
        } catch (err) {
            console.error("Erreur détaillée:", err);
            toast.error("Impossible de charger vos commandes");
            setOrders([]);
        } finally {
            setLoadingOrders(false);
        }
    }, [isAuthenticated, session?.user?.id, page, statusFilter, API_BASE_URL, limit, searchTerm]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        setPage(1);
    }, [statusFilter, searchTerm]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
                        <div className="space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <OrderCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated && !loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-sm border border-white">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaExclamationTriangle className="text-3xl text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
                    <p className="text-gray-600 text-lg">Veuillez vous connecter pour voir vos commandes.</p>
                </div>
            </div>
        );
    }

    const totalPages = Math.ceil(totalOrders / limit);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl pt-20">
                {/* En-tête */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
                        <FaShoppingBag className="text-green-500" />
                        Mes Commandes
                    </h1>
                    <p className="text-xl text-gray-600 flex items-center justify-center gap-2">
                        <FaTruck className="text-blue-500" />
                        Suivez et gérez toutes vos commandes au même endroit
                    </p>
                </div>

                {/* Barre de recherche et statistiques */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="relative max-w-md">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une commande, un produit..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>

                        {totalOrders > 0 && (
                            <div className="text-center lg:text-right">
                                <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                    <FaShoppingBag className="text-xs" />
                                    Commande{totalOrders > 1 ? 's' : ''} au total
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filtres */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <FaFilter className="text-green-500 text-lg" />
                        <h2 className="text-lg font-semibold text-gray-900">Filtrer par statut</h2>
                    </div>
                    <OrderFilters
                        currentFilter={statusFilter}
                        onFilterChange={setStatusFilter}
                        statusCounts={statusCounts}
                    />
                </div>

                {/* Liste des commandes */}
                {loadingOrders ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <OrderCardSkeleton key={i} />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white">
                        <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaBoxOpen className="text-5xl text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucune commande trouvée</h3>
                        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                            {statusFilter === "all" && !searchTerm
                                ? "Vous n'avez pas encore passé de commande. Découvrez nos produits !"
                                : `Aucune commande ne correspond à vos critères de recherche.`}
                        </p>
                        {(statusFilter !== "all" || searchTerm) && (
                            <button
                                onClick={() => {
                                    setStatusFilter("all");
                                    setSearchTerm("");
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 flex items-center gap-2 mx-auto"
                            >
                                <FaShoppingBag />
                                Voir toutes les commandes
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <OrderCard key={order._id} order={order} />
                            ))}
                        </div>

                        {/* Pagination améliorée */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white p-6">
                                <div className="text-sm text-gray-600 flex items-center gap-2">
                                    <FaBoxOpen />
                                    Affichage de {(page - 1) * limit + 1} à {Math.min(page * limit, totalOrders)} sur {totalOrders} commandes
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                                        disabled={page === 1}
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
                                    >
                                        <FaChevronLeft className="text-xs" />
                                        Précédent
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (page <= 3) {
                                                pageNum = i + 1;
                                            } else if (page >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = page - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPage(pageNum)}
                                                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                                                        page === pageNum
                                                            ? "bg-green-600 text-white shadow-lg shadow-green-200"
                                                            : "text-gray-600 hover:bg-gray-100"
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                        disabled={page === totalPages}
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
                                    >
                                        Suivant
                                        <FaChevronRight className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}