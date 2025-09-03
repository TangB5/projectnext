import { useState } from 'react';

interface SettingsManageProps {
    activeTab: string;
}

export default function SettingsManage({ activeTab }: SettingsManageProps) {
    const [activeSetting, setActiveSetting] = useState<string>('general');
    const [formData, setFormData] = useState({
        storeName: 'ModerneMeuble',
        email: 'contact@modernemeuble.com',
        phone: '01 23 45 67 89',
        address: '123 Rue du Meuble, 75000 Paris',
        currency: 'EUR',
        maintenance: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div id="settings" className={`${activeTab === 'settings' ? 'block' : 'hidden'}`}>
            <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center">
                <i className="pi pi-cog mr-2 text-gray-600"></i>
                Paramètres
            </h3>
            
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Menu latéral */}
                <div className="lg:w-64 bg-white p-4 rounded-lg shadow-sm">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setActiveSetting('general')}
                                className={`w-full text-left px-3 py-2 rounded-lg transition ${activeSetting === 'general' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <i className="pi pi-home mr-2"></i>
                                Général
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveSetting('payment')}
                                className={`w-full text-left px-3 py-2 rounded-lg transition ${activeSetting === 'payment' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <i className="pi pi-credit-card mr-2"></i>
                                Paiements
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveSetting('shipping')}
                                className={`w-full text-left px-3 py-2 rounded-lg transition ${activeSetting === 'shipping' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <i className="pi pi-truck mr-2"></i>
                                Livraison
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveSetting('notifications')}
                                className={`w-full text-left px-3 py-2 rounded-lg transition ${activeSetting === 'notifications' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <i className="pi pi-bell mr-2"></i>
                                Notifications
                            </button>
                        </li>
                    </ul>
                </div>
                
                {/* Contenu des paramètres */}
                <div className="flex-1 bg-white p-4 md:p-6 rounded-lg shadow-sm">
                    {activeSetting === 'general' && (
                        <div>
                            <h4 className="text-lg font-bold mb-4 flex items-center">
                                <i className="pi pi-home mr-2"></i>
                                Paramètres généraux
                            </h4>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du magasin</label>
                                    <input
                                        type="text"
                                        name="storeName"
                                        value={formData.storeName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email de contact</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        <option value="EUR">Euro (€)</option>
                                        <option value="USD">Dollar ($)</option>
                                        <option value="GBP">Livre (£)</option>
                                    </select>
                                </div>
                                
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="maintenance"
                                        name="maintenance"
                                        checked={formData.maintenance}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="maintenance" className="ml-2 block text-sm text-gray-700">
                                        Mode maintenance
                                    </label>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition">
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {activeSetting === 'payment' && (
                        <div>
                            <h4 className="text-lg font-bold mb-4 flex items-center">
                                <i className="pi pi-credit-card mr-2"></i>
                                Méthodes de paiement
                            </h4>
                            <p className="text-gray-500">Configuration des méthodes de paiement...</p>
                        </div>
                    )}
                    
                    {activeSetting === 'shipping' && (
                        <div>
                            <h4 className="text-lg font-bold mb-4 flex items-center">
                                <i className="pi pi-truck mr-2"></i>
                                Options de livraison
                            </h4>
                            <p className="text-gray-500">Configuration des options de livraison...</p>
                        </div>
                    )}
                    
                    {activeSetting === 'notifications' && (
                        <div>
                            <h4 className="text-lg font-bold mb-4 flex items-center">
                                <i className="pi pi-bell mr-2"></i>
                                Notifications
                            </h4>
                            <p className="text-gray-500">Configuration des notifications...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}