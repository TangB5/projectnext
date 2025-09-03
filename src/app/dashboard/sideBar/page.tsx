'use client';

import { logout } from "@/app/lib/apiHelpers";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";


interface SideBareProps {
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
    isMobile: boolean;
}

export default function SideBare({ 
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    isMobile,
}: SideBareProps) {
    const changeTab = (tab: string) => {
        setActiveTab(tab);
        if (isMobile) {
            setSidebarCollapsed(true);
        }
    };

    // Version mobile - Barre en bas
    if (isMobile) {
        return (
            <motion.div 
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-800 to-green-700 text-white z-50 shadow-xl"
            >
                <nav className="flex justify-around py-2">
                    {[
                        { id: 'dashboard-home', icon: 'pi-chart-bar', label: 'Accueil' },
                        { id: 'products-management', icon: 'pi-box', label: 'Produits' },
                        { id: 'orders-management', icon: 'pi-shopping-cart', label: 'Commandes' },
                        { id: 'customers-management', icon: 'pi-users', label: 'Clients' },
                        { id: 'settings', icon: 'pi-cog', label: 'Réglages' },
                        { id: 'logout', icon: 'pi-sign-out', label: 'Déconnexion', action: logout }
                    ].map((item) => (
                        <motion.button
                            key={item.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => item.action ? item.action() : changeTab(item.id)}
                            className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                                activeTab === item.id 
                                    ? 'bg-white bg-opacity-20 text-white' 
                                    : 'text-green-100 hover:bg-white hover:bg-opacity-10'
                            }`}
                        >
                            <i className={`pi ${item.icon} text-xl`}></i>
                            <span className="text-xs mt-1">{item.label}</span>
                        </motion.button>
                    ))}
                </nav>
            </motion.div>
        );
    }

    // Version desktop - Barre latérale
    return (
        <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className={`bg-gradient-to-b from-green-800 to-green-700 text-white h-full fixed z-10 shadow-xl ${
                sidebarCollapsed ? 'w-20' : 'w-64'
            }`}
        >
            <div className="p-4 border-b border-green-600 flex justify-between items-center">
                {!sidebarCollapsed ? (
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xl font-bold flex items-center"
                    >
                        <i className="pi pi-box mr-2"></i>
                        ModerneMeuble
                    </motion.h2>
                ) : (
                    <div className="flex justify-center w-full">
                        <i className="pi pi-box text-xl"></i>
                    </div>
                )}
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="text-green-200 hover:text-white p-1 rounded-full hover:bg-green-500/60 hover:bg-opacity-10"
                >
                    <i className={`pi ${
                        sidebarCollapsed ? 'pi-chevron-right' : 'pi-chevron-left'
                    }`}></i>
                </motion.button>
            </div>
            
            <nav className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                <div className="mb-6">
                    {!sidebarCollapsed && (
                        <motion.h3 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs uppercase text-green-300 mb-3 tracking-wider "
                        >
                            Menu Principal
                        </motion.h3>
                    )}
                    <ul className="space-y-1 ">
                        {[
                            { id: 'dashboard-home', icon: 'pi-chart-bar', label: 'Tableau de bord' },
                            { id: 'products-management', icon: 'pi-box', label: 'Produits' },
                            { id: 'orders-management', icon: 'pi-shopping-cart', label: 'Commandes' },
                            { id: 'customers-management', icon: 'pi-users', label: 'Clients' }
                        ].map((item) => (
                            <motion.li
                                key={item.id}
                                whileHover={{ scale: 1.02 }}
                            >
                                <button 
                                    onClick={() => changeTab(item.id)}
                                    className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all ${
                                        activeTab === item.id 
                                            ? 'bg-green-500/60 bg-opacity-20 text-white shadow-md' 
                                            : 'text-green-200 hover:bg-green-500/60 hover:bg-opacity-10'
                                    }`}
                                >
                                    <i className={`pi ${item.icon} ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`}></i>
                                    {!sidebarCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </button>
                            </motion.li>
                        ))}
                    </ul>
                </div>
                
                <div className="mb-6">
                    {!sidebarCollapsed && (
                        <motion.h3 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs uppercase text-green-300 mb-3 tracking-wider"
                        >
                            Préférences
                        </motion.h3>
                    )}
                    <ul className="space-y-1">
                        {[
                            { id: 'settings', icon: 'pi-cog', label: 'Paramètres' },
                            { id: 'logout', icon: 'pi-sign-out', label: 'Déconnexion', action: logout }
                        ].map((item) => (
                            <motion.li
                                key={item.id}
                                whileHover={{ scale: 1.02 }}
                            >
                                <button 
                                    onClick={() => item.action ? item.action() : changeTab(item.id)}
                                    className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all ${
                                        activeTab === item.id 
                                            ? 'bg-white bg-opacity-20 text-white shadow-md' 
                                            : 'text-green-200 hover:bg-green-500/60 hover:bg-opacity-10'
                                    }`}
                                >
                                    <i className={`pi ${item.icon} ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`}></i>
                                    {!sidebarCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </button>
                            </motion.li>
                        ))}
                    </ul>
                </div>

                {!sidebarCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 text-center text-green-300 text-xs"
                    >
                        Version 1.0.0
                    </motion.div>
                )}
            </nav>
        </motion.div>
    );
}