'use client';
import '../globals.css';
import { useState} from 'react';
import 'primeicons/primeicons.css';
import SideBare from './sideBar/page';
import Main from './main/page';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useMobileDetection from './Mobile/useMobileDetection';


export default function DashboardPage() {
    const [showProductModal, setShowProductModal] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard-home');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const isMobile = useMobileDetection();

  

    return (
        <section id="dashboard" className="bg-gray-50 min-h-screen flex flex-col">
            {/* Contenu principal avec padding pour la barre mobile */}
            <div className={`flex-1 flex flex-col ${isMobile ? 'pb-16' : ''} ${
                !isMobile && sidebarCollapsed ? 'ml-20' : !isMobile ? 'ml-64' : ''
            }`}>
                {/* Top Bar */}
                <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-800">
                        {activeTab === 'dashboard-home' && "Tableau de bord"}
                        {activeTab === 'products-management' && "Gestion des produits"}
                        {activeTab === 'orders-management' && "Commandes"}
                        {activeTab === 'customers-management' && "Clients"}
                        {activeTab === 'settings' && "Paramètres"}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button className="text-gray-600 hover:text-green-800 relative">
                                <i className="pi pi-bell text-xl"></i>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <img 
                                src="https://randomuser.me/api/portraits/men/32.jpg" 
                                alt="Profile" 
                                className="w-10 h-10 rounded-full object-cover border-2 border-green-800" 
                            />
                            {!isMobile && !sidebarCollapsed && (
                                <>
                                    <span className="font-medium">Admin</span>
                                    <button className="text-gray-600 hover:text-green-800">
                                        <i className="pi pi-chevron-down"></i>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </header>
                
                {/* Contenu principal */}
                <Main 
                    activeTab={activeTab}
                    showProductModal={showProductModal}
                    setShowProductModal={setShowProductModal}
                />
            </div>

             <ToastContainer position="top-right" autoClose={3000} />

            {/* Sidebar - position différente selon mobile/desktop */}
            <SideBare 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                sidebarCollapsed={isMobile ? true : sidebarCollapsed} 
                setSidebarCollapsed={setSidebarCollapsed}
                isMobile={isMobile}
            />
        </section>
    );
}