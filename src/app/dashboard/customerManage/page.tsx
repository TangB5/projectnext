'use client';

import { useState, useEffect } from 'react';
import Pagination from '../pagination/pagination2';
import { motion } from 'framer-motion';

// Définir la structure des données du client
interface Customer {
    id: string; // Utilisez string pour correspondre aux identifiants du backend
    name: string;
    email: string;
    phone: string;
    orders: number;
    totalSpent: number;
    lastOrder: string;
}

interface CustomerManageProps {
    activeTab: string;
}

export default function CustomerManage({ activeTab }: CustomerManageProps) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Vous pouvez ajuster ce nombre

    useEffect(() => {
        if (activeTab === 'customers-management') {
            const fetchCustomers = async () => {
                setLoading(true);
                setError(null);
                try {
                    // Remplacez 'api/customers' par l'URL de votre backend si elle est différente
                    const response = await fetch('/api/customers');
                    if (!response.ok) {
                        throw new Error('La récupération des clients a échoué.');
                    }
                    const data: Customer[] = await response.json();
                    setCustomers(data);
                } catch (err: unknown) {
                    if (err instanceof Error){
                    setError(err.message);
                    }else{
                        setError (String(err))
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchCustomers();
        }
    }, [activeTab]);

    // Filtrage des clients
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
    );

    // Calcul de la pagination
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (activeTab !== 'customers-management') {
        return null;
    }

    return (
        <div id="customers-management" className={`${activeTab === 'customers-management' ? 'block' : 'hidden'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h3 className="text-lg md:text-xl font-bold flex items-center mb-4 md:mb-0">
                    <i className="pi pi-users mr-2 text-purple-600"></i>
                    Gestion des clients
                </h3>

                <div className="w-full md:w-auto flex gap-3">
                    <div className="relative flex-grow">
                        <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Rechercher client..."
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1); // Réinitialiser la page à 1 lors de la recherche
                            }}
                        />
                    </div>

                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center">
                        <i className="pi pi-plus mr-2"></i>
                        <span className="hidden sm:inline">Nouveau client</span>
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <i className="pi pi-spin pi-spinner text-4xl text-purple-500"></i>
                        <p className="ml-4 text-gray-600">Chargement des clients...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 p-6 rounded-lg border border-red-300 text-center text-red-700">
                        <i className="pi pi-exclamation-triangle text-3xl mb-3"></i>
                        <p className="font-medium">Erreur lors de la récupération des données.</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
                        <i className="pi pi-inbox text-blue-500 text-3xl mb-3"></i>
                        <p className="text-blue-700 font-medium">Aucun client trouvé</p>
                        <p className="text-sm text-blue-600 mt-1">Essayez de modifier vos critères de recherche</p>
                    </div>
                ) : (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        >
                            {paginatedCustomers.map((customer) => (
                                <motion.div 
                                    key={customer.id} 
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-center mb-3">
                                        <div className="bg-purple-100 text-purple-800 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                            <i className="pi pi-user"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{customer.name}</h4>
                                            <p className="text-sm text-gray-500">{customer.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Téléphone:</span>
                                            <span>{customer.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Commandes:</span>
                                            <span>{customer.orders}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Total dépensé:</span>
                                            <span className="font-medium">{customer.totalSpent.toLocaleString()}€</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Dernière commande:</span>
                                            <span>{customer.lastOrder}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t flex justify-end space-x-2">
                                        <button className="text-blue-500 hover:text-blue-700 p-2" title="Voir profil">
                                            <i className="pi pi-eye"></i>
                                        </button>
                                        <button className="text-green-600 hover:text-green-800 p-2" title="Modifier">
                                            <i className="pi pi-pencil"></i>
                                        </button>
                                        <button className="text-red-500 hover:text-red-700 p-2" title="Supprimer">
                                            <i className="pi pi-trash"></i>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                        <div className="mt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                label="clients"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}