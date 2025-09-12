'use client';

import { useState, useEffect } from 'react';
import 'primeicons/primeicons.css'; 
import { useAuth } from '../../lib/authProvider';
import { motion, AnimatePresence } from 'framer-motion';

type OrderItem = {
  productId: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt?: string;
};

const statusStyles = {
  Delivered: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Shipped: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Confirmed: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  Pending: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  Cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
};

const statusIcons = {
  Delivered: 'pi pi-check-circle',
  Shipped: 'pi pi-truck',
  Confirmed: 'pi pi-clock',
  Pending: 'pi pi-hourglass',
  Cancelled: 'pi pi-times-circle'
};

export default function LatestCommands() {
  const { session, loading: sessionLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all'); // Nouvel état pour le filtre
  const ordersPerPage = 5;

  const fetchOrders = async (page: number, statusFilter: string) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/orders?page=${page}&limit=${ordersPerPage}`;
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`; // Ajoutez le paramètre de filtre
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Échec de la récupération des commandes");
      
      const { orders, total }: { orders: Order[], total: number } = await res.json();
      setOrders(orders);
      setTotalOrders(total);
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

  useEffect(() => {
    if (!sessionLoading) {
      // Appelle fetchOrders chaque fois que la page ou le filtre change
      fetchOrders(currentPage, filterStatus);
    }
  }, [currentPage, sessionLoading, filterStatus]); // Ajouter filterStatus comme dépendance

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
              <option value="Pending">En attente</option>
              <option value="Confirmed">Confirmées</option>
              <option value="Shipped">Expédiées</option>
              <option value="Delivered">Livrées</option>
              <option value="Cancelled">Annulées</option>
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
                {orders.map((order) => (
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
                      {order.total.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status].bg} ${statusStyles[order.status].text} ${statusStyles[order.status].border}`}>
                        <i className={statusIcons[order.status]}></i>
                        {order.status === 'Pending' && 'En attente'}
                        {order.status === 'Confirmed' && 'Confirmée'}
                        {order.status === 'Shipped' && 'Expédiée'}
                        {order.status === 'Delivered' && 'Livrée'}
                        {order.status === 'Cancelled' && 'Annulée'}
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Version mobile */}
          <div className="md:hidden space-y-3">
            {orders.map((order) => (
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
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusStyles[order.status].bg} ${statusStyles[order.status].text}`}>
                    <i className={statusIcons[order.status]}></i>
                    <span>
                      {order.status === 'Pending' && 'En attente'}
                      {order.status === 'Confirmed' && 'Confirmée'}
                      {order.status === 'Shipped' && 'Expédiée'}
                      {order.status === 'Delivered' && 'Livrée'}
                      {order.status === 'Cancelled' && 'Annulée'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    <p className="font-medium text-gray-900">{order.total.toLocaleString()} FCFA</p>
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
                              {/* Rendu conditionnel de l'image pour éviter les erreurs */}
                              {item.productId.image && (
                                <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden border border-gray-200">
                                  <img 
                                    src={item.productId.image} 
                                    alt={item.productId.name}
                                    className="w-full h-full object-cover"
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
            ))}
          </div>

          {/* Pagination */}
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