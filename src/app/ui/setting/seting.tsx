"use client"
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import {
    getSettingsAdmin,
    updateGeneralSettingsAdmin,
    updatePaymentSettingsAdmin,
    updateShippingSettingsAdmin,
    updateNotificationSettingsAdmin,
    GeneralSettings,
    PaymentMethod,
    ShippingZone,
    NotificationSettings,
    Settings,
} from '../../lib/Service';



interface SettingsManageProps {
    activeTab: string;
}


const INITIAL_GENERAL_DATA: GeneralSettings = {
    storeName: '',
    email: '',
    phone: '',
    address: '',
    currency: 'XAF',
    maintenance: false
};


export default function SettingsManage({ activeTab }: SettingsManageProps) {
    const [activeSetting, setActiveSetting] = useState<string>('general');


    const [generalData, setGeneralData] = useState<GeneralSettings>(INITIAL_GENERAL_DATA);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
    const [notificationData, setNotificationData] = useState<NotificationSettings>({} as NotificationSettings);

    const [isLoading, setIsLoading] = useState(true);

    // ------------------------------------
    // 1. CHARGEMENT DES DONNÉES (Utilisation de getSettingsAdmin)
    // ------------------------------------
    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {

                const data = await getSettingsAdmin();
                setGeneralData(data.general || INITIAL_GENERAL_DATA);
                setPaymentMethods(data.payments || []);
                setShippingZones(data.shipping || []);
                setNotificationData(data.notifications || {} as NotificationSettings);


                if (activeTab && ['general', 'payment', 'shipping', 'notifications'].includes(activeTab)) {
                    setActiveSetting(activeTab === 'settings' ? 'general' : activeTab);
                }


            } catch (error) {
                console.error("Erreur de l'API de paramètres:", error);
                // @ts-expect-error message d'erreur
                const errorMessage = error.message || "Impossible de charger les paramètres de la boutique.";
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, [activeTab]);

    // ------------------------------------
    // 2. GESTION DES CHANGEMENTS (Inchangé - Logique locale de l'UI)
    // ------------------------------------

    const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setGeneralData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePaymentToggle = (id: string, enabled: boolean) => {
        setPaymentMethods(prev => prev.map(method =>
            method.id === id ? { ...method, enabled } : method
        ));
    };

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNotificationData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleShippingCostChange = (id: string, cost: number) => {
        setShippingZones(prev => prev.map(zone =>
            zone.id === id ? { ...zone, cost: cost } : zone
        ));
    };


    // ------------------------------------
    // 3. GESTION DE L'ENREGISTREMENT (Utilisation des fonctions update spécifiques)
    // ------------------------------------

    const handleSave = useCallback(
        async <K extends keyof Settings>(
            settingKey: K,
            dataToSave: Settings[K]
        ) => {
            const toastId = toast.loading(`Enregistrement des paramètres ${settingKey}...`);

            try {


                switch (settingKey) {
                    case 'general':
                        // The result variable is implicitly typed based on the return type of the helper function
                        const generalResult = await updateGeneralSettingsAdmin(dataToSave as GeneralSettings);
                        setGeneralData(generalResult.general);
                        break;

                    case 'payments':
                        const paymentsResult = await updatePaymentSettingsAdmin(dataToSave as PaymentMethod[]);
                        setPaymentMethods(paymentsResult.payments);
                        break;

                    case 'shipping':
                        const shippingResult = await updateShippingSettingsAdmin(dataToSave as ShippingZone[]);
                        setShippingZones(shippingResult.shipping);
                        break;

                    case 'notifications':
                        const notificationsResult = await updateNotificationSettingsAdmin(dataToSave as NotificationSettings);
                        setNotificationData(notificationsResult.notifications);
                        break;
                }

                toast.success(`Paramètres ${settingKey} enregistrés avec succès !`, { id: toastId });
            } catch (error:unknown) {
                if (error instanceof Error) {
                    console.error("Erreur API:", error);
                    toast.error(error.message || `Échec de l'enregistrement des paramètres ${settingKey}.`, { id: toastId });
                } else {
                    console.error("Erreur API inattendue:", error);
                    toast.error(`Une erreur inattendue est survenue lors de la mise à jour des paramètres ${settingKey}.`, { id: toastId });
                }
            }
        },
        [setGeneralData, setPaymentMethods, setShippingZones, setNotificationData] // Ajoutez les dépendances de setter
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                {/* Utilisation d'une icône de chargement simple et Tailwind */}
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-3 text-gray-600">Chargement des paramètres...</span>
            </div>
        );
    }

    return (
        <div id="settings" className={`${activeTab === 'settings' ? 'block' : 'hidden'}`}>
            <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center text-gray-800">
                {/* L'icône pi-cog est supposée venir d'une librairie comme PrimeIcons */}
                <i className="pi pi-cog mr-2 text-gray-600"></i>
                Paramètres
            </h3>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Menu latéral */}
                <div className="lg:w-64 bg-white p-4 rounded-lg shadow-md border border-gray-100">
                    <ul className="space-y-2">
                        {['general', 'payment', 'shipping', 'notifications'].map(setting => (
                            <li key={setting}>
                                <button
                                    onClick={() => setActiveSetting(setting)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition text-sm font-medium ${activeSetting === setting ? 'bg-emerald-50 text-emerald-800' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {/* Icônes adaptées */}
                                    <i className={`pi pi-${setting === 'general' ? 'home' : setting === 'payment' ? 'credit-card' : setting === 'shipping' ? 'truck' : 'bell'} mr-2`}></i>
                                    {setting === 'general' ? 'Général' : setting === 'payment' ? 'Paiements' : setting === 'shipping' ? 'Livraison' : 'Notifications'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contenu des paramètres */}
                <div className="flex-1 bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-100">

                    {/* ------------------------------------ */}
                    {/* SECTION GÉNÉRAL (CAMEROUN) */}
                    {/* ------------------------------------ */}
                    {activeSetting === 'general' && (
                        <div>
                            <h4 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-700">Paramètres généraux de la boutique</h4>

                            <div className="space-y-4">


                                {Object.keys(generalData).filter(key => key !== 'currency' && key !== 'maintenance').map((key) => {
                                    const value = generalData[key as keyof GeneralSettings];
                                    if (typeof value === 'boolean') return null;


                                    return (
                                        <div key={key}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                                {key === 'storeName' ? 'Nom du magasin' : key === 'email' ? 'Email de contact' : key === 'phone' ? 'Téléphone' : 'Adresse'}
                                            </label>
                                            <input
                                                type={key === 'email' ? 'email' : 'text'}
                                                name={key}
                                                value={value}
                                                onChange={handleGeneralChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    )
                                })}

                                {/* Devise (Adapté au XAF) */}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                                    <select
                                        name="currency"
                                        value={generalData.currency}
                                        onChange={handleGeneralChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="XAF">Franc CFA (XAF)</option>
                                        <option value="EUR">Euro (€)</option>
                                        <option value="USD">Dollar ($)</option>
                                    </select>
                                </div>

                                {/* Mode maintenance */}
                                <div className="flex items-center pt-2">
                                    <input
                                        type="checkbox"
                                        id="maintenance"
                                        name="maintenance"
                                        checked={generalData.maintenance}
                                        onChange={handleGeneralChange}
                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="maintenance" className="ml-2 block text-sm text-gray-700">
                                        Mode maintenance (désactive la boutique)
                                    </label>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => handleSave('general', generalData)}
                                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md"
                                >
                                    Enregistrer les paramètres généraux
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ------------------------------------ */}
                    {/* SECTION PAIEMENTS (Mobile Money inclus) */}
                    {/* ------------------------------------ */}
                    {activeSetting === 'payment' && (
                        <div>
                            <h4 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-700">Méthodes de paiement</h4>

                            <div className="space-y-4">
                                {paymentMethods.map(method => (
                                    <div key={method.id} className="p-4 border rounded-lg flex items-center justify-between shadow-sm">
                                        <div>
                                            <p className="font-semibold text-gray-800 flex items-center">
                                                {method.name}
                                                {method.isMobileMoney && <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Mobile Money</span>}
                                            </p>
                                            <p className="text-sm text-gray-500">{method.description}</p>
                                        </div>

                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={method.enabled}
                                                onChange={(e) => handlePaymentToggle(method.id, e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    // Nous envoyons le tableau entier de paymentMethods
                                    onClick={() => handleSave('payments', paymentMethods)}
                                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md"
                                >
                                    Enregistrer les paiements
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ------------------------------------ */}
                    {/* SECTION LIVRAISON (Zones Camerounaises) */}
                    {/* ------------------------------------ */}
                    {activeSetting === 'shipping' && (
                        <div>
                            <h4 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-700">Options de livraison (Zones Cameroun)</h4>

                            <p className="text-sm text-gray-500 mb-4">Mettez à jour le coût et l&rsquo;état des zones de livraison. Les coûts sont en **{generalData.currency}**.</p>

                            <div className="space-y-4">
                                {shippingZones.map(zone => (
                                    <div key={zone.id} className="p-4 border rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm">
                                        <div className="flex-1 mb-2 md:mb-0">
                                            <p className="font-semibold text-gray-800">{zone.name}</p>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <label className="text-sm text-gray-500 mr-2">Coût ({generalData.currency}):</label>
                                                <input
                                                    type="number"
                                                    value={zone.cost}
                                                    onChange={(e) => handleShippingCostChange(zone.id, parseInt(e.target.value) || 0)}
                                                    className="w-24 px-2 py-1 border border-gray-300 rounded-lg text-right"
                                                />
                                            </div>

                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={zone.enabled}
                                                    onChange={(e) => setShippingZones(prev => prev.map(z => z.id === zone.id ? { ...z, enabled: e.target.checked } : z))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    // Nous envoyons le tableau entier de shippingZones
                                    onClick={() => handleSave('shipping', shippingZones)}
                                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md"
                                >
                                    Enregistrer la livraison
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ------------------------------------ */}
                    {/* SECTION NOTIFICATIONS (Commandes) */}
                    {/* ------------------------------------ */}
                    {activeSetting === 'notifications' && (
                        <div>
                            <h4 className="text-xl font-semibold mb-6 border-b pb-2 text-gray-700">Notifications</h4>

                            <p className="text-gray-600 mb-6">Contrôlez les alertes que vous recevez pour les événements critiques de votre boutique.</p>

                            <div className="space-y-4">

                                {/* Notification Nouvelle Commande */}
                                <div className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
                                    <div>
                                        <label htmlFor="newOrderEmail" className="font-semibold text-gray-800">
                                            Nouvelle commande (Email)
                                        </label>
                                        <p className="text-sm text-gray-500">Recevoir une notification par email lorsqu&rsquo;une nouvelle commande est passée.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        id="newOrderEmail"
                                        name="newOrderEmail"
                                        checked={notificationData.newOrderEmail}
                                        onChange={handleNotificationChange}
                                        className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    />
                                </div>

                                {/* Notification Stock Faible */}
                                <div className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
                                    <div>
                                        <label htmlFor="lowStockAlert" className="font-semibold text-gray-800">
                                            Alerte de stock faible
                                        </label>
                                        <p className="text-sm text-gray-500">Recevoir une alerte lorsque le stock d&rsquo;un produit atteint le seuil critique.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        id="lowStockAlert"
                                        name="lowStockAlert"
                                        checked={notificationData.lowStockAlert}
                                        onChange={handleNotificationChange}
                                        className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    />
                                </div>

                                <div className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
                                    <div>
                                        <label htmlFor="paymentFailureSMS" className="font-semibold text-gray-800">
                                            Échec de paiement (SMS/Alerte)
                                        </label>
                                        <p className="text-sm text-gray-500">Recevoir une alerte immédiate en cas d&rsquo;échec de paiement (particulièrement important pour Mobile Money).</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        id="paymentFailureSMS"
                                        name="paymentFailureSMS"
                                        checked={notificationData.paymentFailureSMS}
                                        onChange={handleNotificationChange}
                                        className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => handleSave('notifications', notificationData)}
                                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md"
                                >
                                    Enregistrer les notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}