'use client';
import '../globals.css';
import { useState, useCallback } from 'react';
import 'primeicons/primeicons.css';
import SideBare from '../ui/sideBar/Sidebar';
import Main from "@/app/ui/main/Main";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useMobileDetection from './Mobile/useMobileDetection';
import DashboardHeader from './DashboardHeader';




export default function DashboardPage() {
    const [showProductModal, setShowProductModal] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard-home');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const isMobile = useMobileDetection();

    // Fonction pour basculer la barre latérale
    const toggleSidebar = useCallback(() => {
        setSidebarCollapsed(prev => !prev);
    }, []);

    const mainContentMarginClass = isMobile
        ? 'pb-16'
        : sidebarCollapsed
            ? 'ml-20' // Sidebar réduite
            : 'ml-64'; // Sidebar complète

    return (
        <section id="dashboard" className="bg-gray-50 min-h-screen flex">

            {/* Sidebar - Fixée à gauche */}
            <SideBare
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarCollapsed={isMobile ? false : sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                isMobile={isMobile}
            />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${mainContentMarginClass}`}>

                <DashboardHeader
                    activeTab={activeTab}
                    sidebarCollapsed={sidebarCollapsed}
                    isMobile={isMobile}
                    toggleSidebar={toggleSidebar}
                />

                {/* Contenu principal de la section */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <Main
                        activeTab={activeTab}
                        showProductModal={showProductModal}
                        setShowProductModal={setShowProductModal}
                    />
                </main>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </section>
    );
}