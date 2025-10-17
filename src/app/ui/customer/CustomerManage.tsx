'use client';

import { useState, useEffect } from 'react';
import { Customer, CustomerManageProps } from '@/app/types';
import Pagination from '@/app/dashboard/pagination/pagination2';
import { getAllUsers,deleteUser,updateUser } from '@/app/lib/apiHelpers';

export default function CustomerManage({ activeTab }: CustomerManageProps) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

// ---------- HANDLERS ----------

// Création d’un nouveau client
// Création d’un nouveau client via le formulaire

// Mise à jour d’un client existant
    const handleUpdateCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedCustomer) return;

        const form = e.currentTarget;
        const formData = new FormData(form);

        const updatedCustomerData: Partial<Customer> = {
            name: formData.get("name")?.toString() || selectedCustomer.name,
            email: formData.get("email")?.toString() || selectedCustomer.email,
            phone: formData.get("phone")?.toString() || selectedCustomer.phone,
        };

        try {
            const updatedCustomer = await updateUser(selectedCustomer.id, updatedCustomerData);
            setCustomers(prev =>
                prev.map(c => (c.id === selectedCustomer.id ? updatedCustomer : c))
            );
            console.log("Mettre à jour client:", selectedCustomer.id, updatedCustomerData);
        } catch (err) {
            console.error("Erreur mise à jour client:", err);
        } finally {
            setShowEditModal(false);
            setSelectedCustomer(null);
        }
    };

// Suppression d’un client
    const handleDeleteCustomer = async () => {
        if (!selectedCustomer) return;

        try {
             await deleteUser(selectedCustomer.id);
             setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));

            console.log("Supprimer client:", selectedCustomer.id);
        } catch (err) {
            console.error("Erreur suppression client:", err);
        } finally {
            setShowDeleteModal(false);
            setSelectedCustomer(null);
        }
    };



    useEffect(() => {
        if (activeTab !== 'customers-management') return;

        const fetchCustomers = async () => {
            setLoading(true);
            setError(null);
            try {
                const users = await getAllUsers(); // retourne tous les utilisateurs

                // Ne garder que les users normaux (role "customer")
                const normalUsers = users.filter(customer => user.roles?.includes("user"));

                // Transforme en Customer
                const customers: Customer[] = normalUsers.map(customer => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: '—',
                    orders: 0,
                    totalSpent: 0,
                    lastOrder: '—',
                }));

                setCustomers(customers);
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError(String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [activeTab]);

    const filteredCustomers = customers.filter(customer =>
        (customer.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.email ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(customer.phone ?? '').includes(searchQuery)
    );


    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (activeTab !== 'customers-management') return null;

    return (
        <div id="customers-management" className="min-h-screen bg-gray-50 py-6">
            {/* Header Section */}
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                            <i className="pi pi-users text-white text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <h1 className="text-2xl font-bold text-gray-900">Gestion des clients</h1>
                            <p className="text-gray-600 mt-1">Gérez et suivez vos clients</p>
                        </div>
                    </div>

                    {/* Search and Actions */}
                    <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 min-w-[280px]">
                            <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Rechercher un client..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 px-6">
                            <div className="relative">
                                <i className="pi pi-spin pi-spinner text-5xl text-green-500"></i>
                                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping"></div>
                            </div>
                            <p className="mt-4 text-gray-600 font-medium">Chargement des clients...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 p-8 rounded-xl border border-red-200 text-center">
                            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="pi pi-exclamation-triangle text-2xl text-red-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
                            <p className="text-red-600 max-w-md mx-auto">{error}</p>
                            <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                                Réessayer
                            </button>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="text-center py-16 px-6">
                            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="pi pi-inbox text-blue-500 text-3xl"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun client trouvé</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {searchQuery ? "Aucun résultat pour votre recherche." : "Commencez par ajouter votre premier client."}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Réinitialiser la recherche
                                </button>
                            ) }
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                                        {['Nom', 'Email', 'Téléphone', 'Commandes', 'Total dépensé', 'Dernière commande', 'Actions'].map((header) => (
                                            <th
                                                key={header}
                                                className="p-4 text-left text-sm font-semibold text-green-900 first:rounded-tl-2xl last:rounded-tr-2xl"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {paginatedCustomers.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="border-b border-gray-100 hover:bg-green-50 transition-colors duration-150 last:border-b-0"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                                        <i className="pi pi-user text-green-600 text-sm"></i>
                                                    </div>
                                                    <span className="font-medium text-gray-900">{customer.name ?? '—'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-700">{customer.email ?? '—'}</td>
                                            <td className="p-4 text-gray-700">{customer.phone ?? '—'}</td>
                                            <td className="p-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                          {customer.orders ?? 0}
                        </span>
                                            </td>
                                            <td className="p-4 font-semibold text-gray-900">
                                                {(customer.totalSpent ?? 0).toLocaleString()} fcfa
                                            </td>
                                            <td className="p-4 text-gray-700">{customer.lastOrder ?? '—'}</td>
                                            <td className="p-4">
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCustomer(customer);
                                                            setShowViewModal(true);
                                                        }}
                                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Voir détails"
                                                    >
                                                        <i className="pi pi-eye"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCustomer(customer);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <i className="pi pi-pencil"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCustomer(customer);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <i className="pi pi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden grid grid-cols-1 gap-4 p-4">
                                {paginatedCustomers.map((customer) => (
                                    <div
                                        key={customer.id}
                                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="bg-green-100 text-green-800 w-12 h-12 rounded-xl flex items-center justify-center mr-4">
                                                    <i className="pi pi-user text-lg"></i>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{customer.name ?? '—'}</h4>
                                                    <p className="text-gray-600 text-sm">{customer.email ?? '—'}</p>
                                                </div>
                                            </div>
                                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {customer.orders ?? 0} commande{customer.orders !== 1 ? 's' : ''}
                                            </div>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-500 font-medium">Téléphone</span>
                                                <span className="text-gray-900">{customer.phone ?? '—'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <span className="text-gray-500 font-medium">Total dépensé</span>
                                                <span className="font-semibold text-green-600">{(customer.totalSpent ?? 0).toLocaleString()} fcfa</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-gray-500 font-medium">Dernière commande</span>
                                                <span className="text-gray-900">{customer.lastOrder ?? '—'}</span>
                                            </div>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedCustomer(customer);
                                                    setShowViewModal(true);
                                                }}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Voir détails"
                                            >
                                                <i className="pi pi-eye"></i>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedCustomer(customer);
                                                    setShowEditModal(true);
                                                }}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <i className="pi pi-pencil"></i>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedCustomer(customer);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <i className="pi pi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
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



            {/* Modal de visualisation */}
            {showViewModal && selectedCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Détails du client</h3>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <i className="pi pi-times text-lg"></i>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center mb-6">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                                    <i className="pi pi-user text-green-600 text-2xl"></i>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h4>
                                    <p className="text-gray-600">{selectedCustomer.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-600 font-medium">Téléphone</span>
                                    <span className="text-gray-900">{selectedCustomer.phone ?? 'Non renseigné'}</span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-600 font-medium">Commandes totales</span>
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedCustomer.orders ?? 0}
                </span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-600 font-medium">Total dépensé</span>
                                    <span className="font-semibold text-green-600">
                  {(selectedCustomer.totalSpent ?? 0).toLocaleString()} fcfa
                </span>
                                </div>

                                <div className="flex justify-between items-center py-3">
                                    <span className="text-gray-600 font-medium">Dernière commande</span>
                                    <span className="text-gray-900">{selectedCustomer.lastOrder ?? 'Aucune commande'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal d'édition */}
            {showEditModal && selectedCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Modifier le client</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <i className="pi pi-times text-lg"></i>
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleUpdateCustomer} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                                    <input
                                        type="text"
                                        required
                                        defaultValue={selectedCustomer.name}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        defaultValue={selectedCustomer.email}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                                    <input
                                        type="tel"
                                        defaultValue={selectedCustomer.phone}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Adresse complète..."
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type='submit'

                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            >
                                <i className="pi pi-check mr-2"></i>
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de suppression */}
            {showDeleteModal && selectedCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <i className="pi pi-times text-lg"></i>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
                                    <i className="pi pi-exclamation-triangle text-red-600 text-2xl"></i>
                                </div>
                            </div>

                            <p className="text-center text-gray-700 mb-2">
                                Êtes-vous sûr de vouloir supprimer le client <strong>{selectedCustomer.name}</strong> ?
                            </p>
                            <p className="text-center text-sm text-gray-500">
                                Cette action est irréversible. Toutes les données associées à ce client seront perdues.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteCustomer}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                            >
                                <i className="pi pi-trash mr-2"></i>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
