'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllOrders, updateOrderStatus, deleteOrder } from '@/app/lib/apiHelpers';
import { Order } from "@/app/types"

// --- HOOK UTILITAIRE ---
function useMobileView(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => setIsMobile(window.innerWidth < breakpoint);
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [breakpoint]);

    return isMobile;
}

// --- COMPOSANT PRINCIPAL ---
export default function OrdersManage({ activeTab }: { activeTab: string }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    // États pour les modales
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [editStatus, setEditStatus] = useState('');
    const [editPayment, setEditPayment] = useState('');
    const [loadingAction, setLoadingAction] = useState(false);

    const isMobile = useMobileView();
    const ordersPerPage = 10;

    type OrderStatus = "En attente" | "En traitement" | "Expédiée" | "Annulée";

    const STATUS_ENUMS = [
        'En attente',
        'En traitement',
        'Expédiée',
        'Annulée',
        'Livrée'
    ];

    const PAYMENT_METHODS = [
        'Carte bancaire',
        'Espèces',
        'Mobile Money'
    ];

    // --- EFFET DE RÉCUPÉRATION DES COMMANDES ---
    useEffect(() => {
        if (activeTab !== 'orders-management') return;

        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllOrders(currentPage, ordersPerPage);
                setOrders(data.orders);
                setTotalOrders(data.total);
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError(String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [activeTab, currentPage]);

    const totalPages = Math.ceil(totalOrders / ordersPerPage);

    // --- FONCTIONS DE GESTION DES MODALES ---
    const openDetailModal = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const openEditModal = (order: Order) => {
        setSelectedOrder(order);
        setEditStatus(order.status);
        setEditPayment(order.paymentMethod || 'non précisé');
        setShowEditModal(true);
    };

    const openDeleteModal = (order: Order) => {
        setSelectedOrder(order);
        setShowDeleteModal(true);
    };

    const closeModals = () => {
        setShowDetailModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedOrder(null);
        setEditStatus('');
        setEditPayment('');
        setLoadingAction(false);
    };

    // --- FONCTIONS D'ACTIONS ---
    const handleUpdateOrder = async () => {
        if (!selectedOrder) return;

        setLoadingAction(true);
        try {
            const updatedOrder = await updateOrderStatus(selectedOrder._id, {
                status: editStatus as OrderStatus | undefined,
                paymentMethod: editPayment
            });


            setOrders(prev => prev.map(order =>
                order._id === selectedOrder._id ? updatedOrder : order
            ));

            closeModals();
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError(String(err));
        } finally {
            setLoadingAction(false);
        }
    };
    const handleDeleteOrder = async () => {
        if (!selectedOrder) return;

        setLoadingAction(true);
        try {
            await deleteOrder(selectedOrder._id);

            // Mettre à jour l'état local
            setOrders(prev => prev.filter(order => order._id !== selectedOrder._id));
            setTotalOrders(prev => prev - 1);

            closeModals();
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError(String(err));
        } finally {
            setLoadingAction(false);
        }
    };

    // --- FILTRAGE ---
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.userId.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    // --- CONFIGURATION DU STATUT ---
    const getStatusConfig = (status: string) => {
        const config = {
            'En attente': { color: 'bg-gray-100 text-gray-800 border border-gray-300', icon: 'pi pi-hourglass' },
            'En traitement': { color: 'bg-yellow-100 text-yellow-800 border border-yellow-300', icon: 'pi pi-clock' },
            'Expédiée': { color: 'bg-blue-100 text-blue-800 border border-blue-300', icon: 'pi pi-truck' },
            'Annulée': { color: 'bg-red-100 text-red-800 border border-red-300', icon: 'pi pi-times-circle' },
            'Livrée': { color: 'bg-green-100 text-green-800 border border-green-300', icon: 'pi pi-check-circle' },
        };
        return config[status as keyof typeof config] || config['En attente'];
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (activeTab !== 'orders-management') return null;

    return (
        <div id="orders-management">
            {/* --- Header / Search / Filter --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                        <i className="pi pi-shopping-cart mr-3 text-blue-600"></i>
                        Gestion des commandes
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{totalOrders} commande(s) au total</p>
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                        <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Rechercher par client..."
                            className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <select
                            className="appearance-none pl-3 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="all">Tous les statuts</option>
                            {STATUS_ENUMS.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <i className="pi pi-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                </div>
            </div>

            {/* --- Orders Table / Mobile View --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
                        <p className="ml-4 text-gray-600">Chargement des commandes...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center text-red-700">
                        <i className="pi pi-exclamation-triangle text-3xl mb-3"></i>
                        <p className="font-medium">Erreur lors de la récupération des données.</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-blue-50 p-8 rounded-xl border border-blue-200 text-center">
                        <i className="pi pi-inbox text-blue-500 text-4xl mb-4"></i>
                        <p className="text-blue-700 font-medium text-lg">Aucune commande trouvée</p>
                        <p className="text-sm text-blue-600 mt-2">Essayez de modifier vos critères de recherche</p>
                    </div>
                ) : (
                    <>
                        {isMobile ? (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">CMD-{order._id.slice(-8)}</h4>
                                                <p className="text-sm text-gray-600 font-medium">{order.userId.name}</p>
                                            </div>
                                            <span className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1 font-medium ${getStatusConfig(order.status).color}`}>
                                                <i className={getStatusConfig(order.status).icon}></i>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                            <div>
                                                <p className="text-gray-500 text-xs font-medium">Date</p>
                                                <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs font-medium">Articles</p>
                                                <p className="font-semibold">{order.items.length}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs font-medium">Montant</p>
                                                <p className="font-bold text-green-600">{formatCurrency(order.totalAmount)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs font-medium">Paiement</p>
                                                <p className="font-semibold">{order.paymentMethod}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-2 transition-colors"
                                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                            >
                                                {expandedOrder === order._id ? 'Masquer' : 'Voir'} détails
                                                <i className={`pi ${expandedOrder === order._id ? 'pi-chevron-up' : 'pi-chevron-down'}`}></i>
                                            </button>

                                            <div className="flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 p-2 rounded-xl hover:bg-blue-50 transition-all duration-200"
                                                    title="Voir détails"
                                                    onClick={() => openDetailModal(order)}
                                                >
                                                    <i className="pi pi-eye"></i>
                                                </button>
                                                <button
                                                    className="text-green-600 hover:text-green-800 p-2 rounded-xl hover:bg-green-50 transition-all duration-200"
                                                    title="Modifier"
                                                    onClick={() => openEditModal(order)}
                                                >
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                                                    title="Supprimer"
                                                    onClick={() => openDeleteModal(order)}
                                                >
                                                    <i className="pi pi-trash"></i>
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
                                                    className="mt-4 pt-4 border-t border-gray-100"
                                                >
                                                    <h5 className="font-semibold text-gray-900 mb-3 text-sm">Détails de la commande</h5>
                                                    <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg">
                                                        <p><span className="text-gray-500 font-medium">Adresse:</span> {order.details?.address}</p>
                                                        {order.details?.trackingNumber && (
                                                            <p><span className="text-gray-500 font-medium">N° de suivi:</span> {order.details.trackingNumber}</p>
                                                        )}
                                                        {order.details?.estimatedDelivery && (
                                                            <p><span className="text-gray-500 font-medium">Livraison estimée:</span> {order.details.estimatedDelivery}</p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Commande</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Articles</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Montant</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paiement</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <motion.tr
                                            key={order._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-50/80 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                CMD-{order._id.slice(-8)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{order.userId.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">{order.items.length}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{formatCurrency(order.totalAmount)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{order.paymentMethod}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-2 text-xs rounded-full flex items-center gap-1 w-fit font-semibold ${getStatusConfig(order.status).color}`}>
                                                    <i className={getStatusConfig(order.status).icon}></i>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-800 p-2 rounded-xl hover:bg-blue-50 transition-all duration-200"
                                                        title="Voir détails"
                                                        onClick={() => openDetailModal(order)}
                                                    >
                                                        <i className="pi pi-eye"></i>
                                                    </button>
                                                    <button
                                                        className="text-green-600 hover:text-green-800 p-2 rounded-xl hover:bg-green-50 transition-all duration-200"
                                                        title="Modifier"
                                                        onClick={() => openEditModal(order)}
                                                    >
                                                        <i className="pi pi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-all duration-200"
                                                        title="Supprimer"
                                                        onClick={() => openDeleteModal(order)}
                                                    >
                                                        <i className="pi pi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-gray-500 font-medium">
                                Affichage de {(currentPage - 1) * ordersPerPage + 1} à {Math.min(currentPage * ordersPerPage, totalOrders)} sur {totalOrders} commandes
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className={`p-3 rounded-xl border transition-all ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed bg-gray-100' : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'}`}
                                >
                                    <i className="pi pi-chevron-left"></i>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-12 h-12 rounded-xl border flex items-center justify-center font-semibold transition-all ${currentPage === page ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'}`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`p-3 rounded-xl border transition-all ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed bg-gray-100' : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'}`}
                                >
                                    <i className="pi pi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* --- MODALE DE DÉTAILS --- */}
            <AnimatePresence>
                {showDetailModal && selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={closeModals}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Détails de la commande</h3>
                                <button
                                    onClick={closeModals}
                                    className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all"
                                >
                                    <i className="pi pi-times text-lg"></i>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">ID Commande</p>
                                        <p className="font-semibold">CMD-{selectedOrder._id.slice(-8)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Client</p>
                                        <p className="font-semibold">{selectedOrder.userId.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Statut</p>
                                        <span className={`px-3 py-1 text-xs rounded-full inline-flex items-center gap-1 ${getStatusConfig(selectedOrder.status).color}`}>
                                            <i className={getStatusConfig(selectedOrder.status).icon}></i>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Articles commandés</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">{item.productId.name}</p>
                                                    <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                                                </div>
                                                <p className="font-semibold text-green-600">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <p className="text-sm text-gray-500">Méthode de paiement</p>
                                        <p className="font-semibold">{selectedOrder.paymentMethod}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Montant total</p>
                                        <p className="font-bold text-green-600 text-xl">{formatCurrency(selectedOrder.totalAmount)}</p>
                                    </div>
                                </div>

                                {selectedOrder.details && (
                                    <div className="pt-4 border-t">
                                        <h4 className="font-semibold text-gray-900 mb-3">Informations de livraison</h4>
                                        <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                                            <p><span className="text-gray-500 font-medium">Adresse:</span> {selectedOrder.details.address}</p>
                                            {selectedOrder.details.trackingNumber && (
                                                <p><span className="text-gray-500 font-medium">N° de suivi:</span> {selectedOrder.details.trackingNumber}</p>
                                            )}
                                            {selectedOrder.details.estimatedDelivery && (
                                                <p><span className="text-gray-500 font-medium">Livraison estimée:</span> {selectedOrder.details.estimatedDelivery}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MODALE D'ÉDITION --- */}
            <AnimatePresence>
                {showEditModal && selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={closeModals}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Modifier la commande</h3>
                                <button
                                    onClick={closeModals}
                                    className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all"
                                >
                                    <i className="pi pi-times text-lg"></i>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Statut de la commande
                                    </label>
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                    >
                                        {STATUS_ENUMS.map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Méthode de paiement
                                    </label>
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        value={editPayment}
                                        onChange={(e) => setEditPayment(e.target.value)}
                                    >
                                        {PAYMENT_METHODS.map((method) => (
                                            <option key={method} value={method}>{method}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={closeModals}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleUpdateOrder}
                                    disabled={loadingAction}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loadingAction ? (
                                        <>
                                            <i className="pi pi-spin pi-spinner"></i>
                                            Mise à jour...
                                        </>
                                    ) : (
                                        <>
                                            <i className="pi pi-check"></i>
                                            Mettre à jour
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MODALE DE SUPPRESSION --- */}
            <AnimatePresence>
                {showDeleteModal && selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={closeModals}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <i className="pi pi-exclamation-triangle text-2xl text-red-600"></i>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">Supprimer la commande</h3>
                                <p className="text-gray-500 mb-6">
                                    Êtes-vous sûr de vouloir supprimer la commande <strong>CMD-{selectedOrder._id.slice(-8)}</strong> ? Cette action est irréversible.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={closeModals}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDeleteOrder}
                                    disabled={loadingAction}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loadingAction ? (
                                        <>
                                            <i className="pi pi-spin pi-spinner"></i>
                                            Suppression...
                                        </>
                                    ) : (
                                        <>
                                            <i className="pi pi-trash"></i>
                                            Supprimer
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}