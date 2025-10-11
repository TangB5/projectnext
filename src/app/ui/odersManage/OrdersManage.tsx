'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllOrders } from '@/app/lib/apiHelpers';
import {Order} from "@/app/types"



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

export default function OrdersManage({ activeTab }: { activeTab: string }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const isMobile = useMobileView();
    const ordersPerPage = 10;

    useEffect(() => {
        if (activeTab !== 'orders-management') return;

        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAllOrders(currentPage, ordersPerPage);
                setOrders(data.orders); // <-- directement compatible avec Order[]
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

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.userId.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusConfig = (status: string) => {
        const config = {
            'En attente': { color: 'bg-gray-100 text-gray-800', icon: 'pi pi-hourglass' },
            'En traitement': { color: 'bg-yellow-100 text-yellow-800', icon: 'pi pi-clock' },
            'Expédiée': { color: 'bg-blue-100 text-blue-800', icon: 'pi pi-truck' },
            'Annulée': { color: 'bg-red-100 text-red-800', icon: 'pi pi-times-circle' },
        };
        return config[status as keyof typeof config] || config['En attente'];
    };

    if (activeTab !== 'orders-management') return null;

    return (
        <div id="orders-management">
            {/* --- Header / Search / Filter --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <i className="pi pi-shopping-cart mr-2 text-blue-600"></i>
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
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <select
                            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="en attente">En attente</option>
                            <option value="en cours">En cours</option>
                            <option value="expédié">Expédié</option>
                            <option value="livré">Livré</option>
                            <option value="annulé">Annulé</option>
                        </select>
                        <i className="pi pi-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                </div>
            </div>

            {/* --- Orders Table / Mobile View --- */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
                        <p className="ml-4 text-gray-600">Chargement des commandes...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 p-6 rounded-lg border border-red-300 text-center text-red-700">
                        <i className="pi pi-exclamation-triangle text-3xl mb-3"></i>
                        <p className="font-medium">Erreur lors de la récupération des données.</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
                        <i className="pi pi-inbox text-blue-500 text-3xl mb-3"></i>
                        <p className="text-blue-700 font-medium">Aucune commande trouvée</p>
                        <p className="text-sm text-blue-600 mt-1">Essayez de modifier vos critères de recherche</p>
                    </div>
                ): (
                    <>
                        {isMobile ? (
                            <div className="space-y-3">
                                {filteredOrders.map((order) => (
                                    <motion.div 
                                        key={order._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-900">ID: {order._id}</h4>
                                                <p className="text-sm text-gray-600">{order.userId.name}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusConfig(order.status).color}`}>
                                                <i className={getStatusConfig(order.status).icon}></i>
                                                {order.status}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                                            <div>
                                                <p className="text-gray-500 text-xs">Date</p>
                                                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Articles</p>
                                                <p>{order.items.length}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Montant</p>
                                                <p className="font-medium">{order.totalAmount}fcfa</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Paiement</p>
                                                <p>{order.paymentMethod}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-3 pt-3 border-t flex justify-between items-center">
                                            <button 
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                            >
                                                {expandedOrder === order._id ? 'Masquer' : 'Voir'} détails
                                                <i className={`pi ${expandedOrder === order._id ? 'pi-chevron-up' : 'pi-chevron-down'}`}></i>
                                            </button>
                                            
                                            <div className="flex space-x-2">
                                                <button 
                                                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition"
                                                    title="Voir détails"
                                                >
                                                    <i className="pi pi-eye"></i>
                                                </button>
                                                <button 
                                                    className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50 transition"
                                                    title="Modifier"
                                                >
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                <button 
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                                    title="Supprimer"
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
                                                    className="mt-3 pt-3 border-t"
                                                >
                                                    <h5 className="font-medium text-gray-900 mb-2">Détails de la commande</h5>
                                                    <div className="space-y-2 text-sm">
                                                        <p><span className="text-gray-500">Adresse:</span> {order.details?.address}</p>
                                                        {order.details?.trackingNumber && (
                                                            <p><span className="text-gray-500">N° de suivi:</span> {order.details.trackingNumber}</p>
                                                        )}
                                                        {order.details?.estimatedDelivery && (
                                                            <p><span className="text-gray-500">Livraison estimée:</span> {order.details.estimatedDelivery}</p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredOrders.length > 0 ? (
                                            filteredOrders.map((order) => (
                                                <motion.tr 
                                                    key={order._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ID: {order._id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.userId.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items.length}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.totalAmount} €</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.paymentMethod}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${getStatusConfig(order.status).color}`}>
                                                            <i className={getStatusConfig(order.status).icon}></i>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-2">
                                                            <button 
                                                                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition"
                                                                title="Voir détails"
                                                            >
                                                                <i className="pi pi-eye"></i>
                                                            </button>
                                                            <button 
                                                                className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50 transition"
                                                                title="Modifier"
                                                            >
                                                                <i className="pi pi-pencil"></i>
                                                            </button>
                                                            <button 
                                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
                                                                title="Supprimer"
                                                            >
                                                                <i className="pi pi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-8 text-center">
                                                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 inline-block">
                                                        <i className="pi pi-inbox text-blue-500 text-3xl mb-3"></i>
                                                        <p className="text-blue-700 font-medium">Aucune commande trouvée</p>
                                                        <p className="text-sm text-blue-600 mt-1">Essayez de modifier vos critères de recherche</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                    </>
                )}
            </div>
        </div>
    );
}