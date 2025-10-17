'use client';

import { useState, useEffect } from 'react';
import 'primeicons/primeicons.css';
import { useAuth } from '../../lib/authProvider';
import { motion, AnimatePresence } from 'framer-motion';
import {User} from "../../types";
// Import de Next Image
import Image from 'next/image';



// Représente l'objet produit *populé* par le backend (dans 'items')
type PopulatedProduct = {
    _id: string;
    name: string;
    price: number;
    image?: string;
};

// Représente un article de commande *avec* le produit populé
type OrderItemPopulated = {
    productId: PopulatedProduct;
    quantity: number;
    price: number; // Prix unitaire au moment de l'achat
};

// Types de statut définis par votre backend
type OrderStatus = 'En attente' | 'En traitement' | 'Expédiée' | 'Annulée';

// Type de commande final (synchronisé avec totalAmount et les nouveaux statuts)
type Order = {
    _id: string;
    userId: User;
    items: OrderItemPopulated[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    updatedAt?: string;
};

// --- Mise à jour des Styles et Icônes de Statut ---

// Mettez à jour les clés pour correspondre aux statuts du backend
const statusStyles: Record<OrderStatus, { bg: string; text: string; border: string }> = {
    'Expédiée': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'En traitement': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'En attente': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
    'Annulée': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
    // 'Delivered' et 'Confirmed' ont été retirés si non présents dans votre statut d'interface
};

const statusIcons: Record<OrderStatus, string> = {
    'Expédiée': 'pi pi-truck',
    'En traitement': 'pi pi-clock',
    'En attente': 'pi pi-hourglass',
    'Annulée': 'pi pi-times-circle'
};

// Mappage pour l'affichage dans le filtre et le tableau
const statusDisplayMap: Record<OrderStatus, string> = {
    'En attente': 'En attente',
    'En traitement': 'En traitement',
    'Expédiée': 'Expédiée',
    'Annulée': 'Annulée'
};


export default function LatestCommands() {
    const { session, loading: sessionLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const ordersPerPage = 5;


    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

    const fetchOrders = async (page: number, statusFilter: string) => {
        setLoading(true);
        setError(null);
        try {
            let url = `${API_BASE_URL}api/orders/latest?page=${page}&limit=${ordersPerPage}`;
            if (statusFilter !== 'all') {
                url += `&status=${statusFilter}`;
            }

            // Ajout des credentials si l'API nécessite une session/cookie
            const res = await fetch(url, { credentials: 'include' });

            if (!res.ok) throw new Error(`Échec de la récupération des commandes: ${res.statusText}`);

            // Le JSON de retour doit correspondre à { orders: Order[], total: number }
            const data: { orders: Order[], total: number } = await res.json();
            setOrders(data.orders);
            setTotalOrders(data.total);
        } catch (err: unknown) {
            if (err instanceof Error) {
                // Afficher un message plus convivial pour les erreurs réseau/serveur
                setError("Impossible de contacter le serveur ou d'obtenir les données.");
            } else {
                setError(String(err));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!sessionLoading) {

            fetchOrders(currentPage, filterStatus);
        }
    }, [currentPage, sessionLoading, filterStatus]); // Dépendances à jour

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1); // Réinitialiser la page à 1 à chaque changement de filtre
    };

    const totalPages = Math.ceil(totalOrders / ordersPerPage);
    const visiblePages = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Fonction utilitaire pour éviter les erreurs TypeScript
    const getStatusInfo = (status: string) => {
        // Vérifie si le statut est une clé valide avant d'y accéder
        const validStatus = status as OrderStatus;
        if (statusStyles.hasOwnProperty(validStatus)) {
            return {
                styles: statusStyles[validStatus],
                icon: statusIcons[validStatus],
                display: statusDisplayMap[validStatus]
            };
        }
        // Fallback pour les statuts inconnus/erronés
        return {
            styles: { bg: 'bg-gray-200', text: 'text-gray-900', border: 'border-gray-300' },
            icon: 'pi pi-question-circle',
            display: status || 'Inconnu'
        };
    };

    if (sessionLoading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500">Chargement de la session...</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-red-500">Accès refusé. Veuillez vous connecter.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <i className="pi pi-shopping-cart text-blue-600"></i>
                        Historique des commandes
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {totalOrders} commandes au total
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onChange={handleStatusChange}
                            value={filterStatus}
                        >
                            <option value="all">Tous les statuts</option>
                            {/* Utilisation des statuts réels du backend */}
                            <option value="En attente">En attente</option>
                            <option value="En traitement">En traitement</option>
                            <option value="Expédiée">Expédiée</option>
                            <option value="Annulée">Annulée</option>
                        </select>
                        <i className="pi pi-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-lg animate-pulse h-24"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-start">
                    <i className="pi pi-exclamation-circle text-red-500 mt-1 mr-3"></i>
                    <div>
                        <p className="font-medium text-red-700">Erreur de chargement</p>
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
                    <i className="pi pi-inbox text-blue-500 text-4xl mb-3"></i>
                    <p className="text-blue-700 font-medium">Aucune commande trouvée</p>
                    <p className="text-sm text-blue-600 mt-1">Vos commandes apparaîtront ici</p>
                </div>
            ) : (
                <>
                    {/* Version desktop */}
                    <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => {
                                const info = getStatusInfo(order.status);
                                return (
                                    <motion.tr
                                        key={order._id}
                                        className="hover:bg-gray-50"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm font-medium text-gray-900">#{order._id.substring(0, 8).toUpperCase()}</p>
                                            <p className="text-xs text-gray-500">{order.items.length} article(s)</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-gray-900">{order.userId.name}</p>
                                            <p className="text-xs text-gray-500">{order.userId.email}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.totalAmount.toLocaleString()} FCFA {/* Changement ici */}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${info.styles.bg} ${info.styles.text} ${info.styles.border}`}>
                                                <i className={info.icon}></i>
                                                {info.display}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition"
                                                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                                >
                                                    <i className="pi pi-eye"></i>
                                                </button>
                                                <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-50 transition">
                                                    <i className="pi pi-ellipsis-v"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    {/* Version mobile */}
                    <div className="md:hidden space-y-3">
                        {orders.map((order) => {
                            const info = getStatusInfo(order.status);
                            return (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-gray-900">#{order._id.substring(0, 8).toUpperCase()}</p>
                                            <p className="text-sm text-gray-500">{order.userId.name}</p>
                                        </div>
                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${info.styles.bg} ${info.styles.text}`}>
                                            <i className={info.icon}></i>
                                            <span>{info.display}</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                            <p className="font-medium text-gray-900">{order.totalAmount.toLocaleString()} FCFA</p> {/* Changement ici */}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                            >
                                                <i className="pi pi-eye"></i>
                                            </button>
                                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition">
                                                <i className="pi pi-ellipsis-v"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedOrder === order._id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="mt-3 pt-3 border-t border-gray-200"
                                            >
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Articles ({order.items.length})</h4>
                                                <ul className="space-y-2">
                                                    {order.items.map((item, index) => (
                                                        <li key={item.productId._id || index} className="flex items-center gap-3">
                                                            {/* Remplacement de <img> par <Image /> de Next.js */}
                                                            {item.productId.image && (
                                                                <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden border border-gray-200 relative flex-shrink-0">
                                                                    <Image
                                                                        src={item.productId.image}
                                                                        alt={item.productId.name}
                                                                        fill // Remplir le conteneur parent (w-10 h-10)
                                                                        sizes="40px" // Optionnel, mais bonne pratique
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="flex-1">
                                                                <p className="text-sm text-gray-800">{item.productId.name}</p>
                                                                <p className="text-xs text-gray-500">{item.quantity} × {item.price.toLocaleString()} FCFA</p>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Pagination (Aucun changement nécessaire) */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-gray-500">
                                Affichage de {(currentPage - 1) * ordersPerPage + 1} à {Math.min(currentPage * ordersPerPage, totalOrders)} sur {totalOrders} commandes
                            </p>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-lg border ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <i className="pi pi-chevron-left"></i>
                                </button>

                                {visiblePages().map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-lg border flex items-center justify-center ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-lg border ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <i className="pi pi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}