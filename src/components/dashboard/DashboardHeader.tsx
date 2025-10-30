'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "@/app/lib/authProvider";
import { useDashboard } from "@/app/contexts/DashboardContext";
import toast from "react-hot-toast";
import { useRouter, usePathname } from 'next/navigation';

// --- MOCK MODAL (À remplacer par votre implémentation réelle) ---
const LogoutConfirmModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4"
        onClick={onCancel}
    >
        <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
        >
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmer la déconnexion</h3>
            <p className="text-sm text-gray-600 mb-6">Êtes-vous sûr de vouloir vous déconnecter de la session administrateur ?</p>
            <div className="flex justify-end space-x-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-600 hover:bg-gray-100 transition"
                >
                    Annuler
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                    Déconnexion
                </button>
            </div>
        </motion.div>
    </motion.div>
);
// -----------------------------------------------------------------


// Icone Cloche (Bell)
const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);

// Icone Flèche Bas (ChevronDown)
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);

// Icone Déconnexion (SignOutAlt)
const SignOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);

// Icone Utilisateur (User)
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

// Icone Menu (ListFill)
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

// Icone Fermer (XBold)
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);


// Composant pour les options du menu déroulant
const DropdownItem = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg text-left"
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);


export default function DashboardHeader() {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { session, loading, logout } = useAuth();
    const { sidebarCollapsed, isMobile, toggleSidebar } = useDashboard();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const profileMenuRef = useRef<HTMLDivElement>(null);

    const username = session?.user?.name || "Admin";

    // -----------------------------
    // Gestion clic à l'extérieur du dropdown profil
    // -----------------------------
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target as Node)
            ) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // -----------------------------
    // Navigation simple
    // -----------------------------
    const handleNavigation = (path: string) => {
        router.push(path);
        setShowProfileMenu(false);
    };

    // -----------------------------
    // Déconnexion (Utilisation du hook useAuth)
    // -----------------------------
    const handleLogoutClick = () => setShowLogoutModal(true);

    const handleLogoutConfirm = async () => {
        try {
            await logout(); // Appel de la fonction de déconnexion du contexte
            setShowLogoutModal(false);
            toast.success("Déconnexion réussie !");
            // Redirection vers la page d'accueil ou de connexion
            router.push("/");
        } catch (err) {
            console.error("Erreur lors de la déconnexion:", err);
            toast.error("Impossible de se déconnecter.");
        }
    };

    const handleLogoutCancel = () => setShowLogoutModal(false);

    const getTitle = () => {
        if (pathname === '/dashboard') return "Tableau de bord";
        if (pathname === '/dashboard/products') return "Gestion des produits";
        if (pathname === '/dashboard/orders') return "Commandes";
        if (pathname === '/dashboard/customers') return "Clients";
        if (pathname === '/dashboard/settings') return "Paramètres";
        return "Dashboard";
    };

    if (loading) {
        // Optionnel: afficher un état de chargement si nécessaire
        return (
            <header className="bg-white shadow-md p-4 h-16 flex items-center justify-between sticky top-0 z-40">
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </header>
        );
    }

    return (
        <>
            <header className="bg-white shadow-md border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-40 h-16">

                {/* 1. Bouton Sidebar (UNIQUEMENT Mobile) */}
                {isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-600 hover:text-emerald-600 mr-4 transition-colors"
                    >
                        {sidebarCollapsed
                            ? <MenuIcon className="text-2xl w-6 h-6" />
                            : <CloseIcon className="text-2xl w-6 h-6" />
                        }
                    </button>
                )}

                {/* 2. Titre Dynamique */}
                <h2 className="text-xl font-bold text-gray-800 truncate">
                    {getTitle()}
                </h2>

                {/* 3. Actions et Profil */}
                <div className="flex items-center space-x-4 ml-auto">

                    {/* 3a. Notifications */}
                    <div className="relative">
                        <button className="text-gray-600 hover:text-emerald-800 relative p-2 rounded-full hover:bg-gray-50 transition-all">
                            <BellIcon className="text-xl w-6 h-6" />
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white transform translate-x-1 -translate-y-1">
                                3
                            </span>
                        </button>
                    </div>

                    {/* 3b. Menu Profil */}
                    <div className="relative" ref={profileMenuRef}>
                        {/* Bouton pour ouvrir le menu */}
                        <motion.button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-800 hover:bg-gray-100 transition-all duration-200"
                            whileTap={{ scale: 0.98 }}
                        >
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500"
                            />
                            {/* Masqué si mobile OU sidebar est ouverte (pour économiser l'espace) */}
                            {!isMobile && !sidebarCollapsed && (
                                <span className="font-medium text-sm hidden sm:inline">{username}</span>
                            )}
                            <motion.div animate={{ rotate: showProfileMenu ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDownIcon className="text-xs text-gray-400 hidden sm:inline w-4 h-4" />
                            </motion.div>
                        </motion.button>

                        {/* Menu déroulant */}
                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-12 right-0 bg-white rounded-xl shadow-2xl py-2 w-56 border border-gray-100 z-50 origin-top-right"
                                >
                                    <div className="px-4 pb-2 border-b border-gray-100 mb-1">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{username}</p>
                                        <p className="text-xs text-gray-500">Administrateur</p>
                                    </div>

                                    {/* Option pour naviguer vers le profil complet */}
                                    <DropdownItem
                                        icon={<UserIcon className="w-5 h-5 text-emerald-500" />}
                                        label="Mon Profil Public"
                                        onClick={() => handleNavigation('/ui/MyProfile')}
                                    />

                                    <div className="border-t border-gray-100 mt-2 pt-2 mx-2">
                                        {/* Option Déconnexion */}
                                        <DropdownItem
                                            icon={<SignOutIcon className="w-5 h-5 text-red-500" />}
                                            label="Déconnexion"
                                            onClick={handleLogoutClick}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* Modale de confirmation de déconnexion */}
            <AnimatePresence>
                {showLogoutModal && (
                    <LogoutConfirmModal
                        onConfirm={handleLogoutConfirm}
                        onCancel={handleLogoutCancel}
                    />
                )}
            </AnimatePresence>
        </>
    );
}