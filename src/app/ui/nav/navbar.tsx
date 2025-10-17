"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import { LogoutConfirmModal } from "@/app/ui/component/modals/LogoutConfirmModal";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "@/app/lib/authProvider";
import {
    FaUser,
    FaShoppingCart,
    FaBoxOpen,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaChevronDown,
    FaHome,
    FaInfoCircle,
    FaEnvelope,
    FaStore,
    FaShieldAlt,

} from 'react-icons/fa';

// Accès à la variable d'environnement au niveau du module
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function Navbar() {
    const { session, isAuthenticated, loading, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [, setIsHoveringProfile] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // -----------------------------
    // Fermer dropdown si clic à l'extérieur
    // -----------------------------
    useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
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
    // Scroll effect amélioré
    // -----------------------------
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // -----------------------------
    // Panier dynamique
    // -----------------------------
    useEffect(() => {
        if (!isAuthenticated || !API_BASE_URL) {
            setCartCount(0);
            return;
        }

        const fetchCartCount = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}api/orders/cart/count`, {
                    credentials: "include",
                    cache: 'no-cache'
                });
                if (res.ok) {
                    const data = await res.json();
                    setCartCount(data.count || 0);
                }
            } catch (err) {
                console.error("Erreur récupération panier :", err);
            }
        };

        fetchCartCount();

        // Polling pour les mises à jour en temps réel
        const interval = setInterval(fetchCartCount, 30000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // -----------------------------
    // Gestion du scroll
    // -----------------------------
    const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();

        if (pathname === "/") {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
                setIsOpen(false);
            }
        } else {
            router.push(`/#${targetId}`);
            setIsOpen(false);
        }
    };

    // Effet pour scroller après la navigation vers l'accueil
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const element = document.getElementById(targetId);
            if (element) {
                const timer = setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);

                const cleanUrlTimer = setTimeout(() => {
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                }, 500);

                return () => {
                    clearTimeout(timer);
                    clearTimeout(cleanUrlTimer);
                };
            }
        }
    }, [pathname]);

    const handleLogoutClick = () => {
        setShowProfileMenu(false);
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = async () => {
        try {
            await logout();
            setShowLogoutModal(false);
            toast.success("Déconnexion réussie !");
            router.push("/");
        } catch (err) {
            console.error("Erreur lors de la déconnexion:", err);
            toast.error("Impossible de se déconnecter.");
        }
    };

    const handleLogoutCancel = () => setShowLogoutModal(false);

    const NavLink = ({ href, children, icon, targetId }: {
        href: string;
        children: React.ReactNode;
        icon?: React.ReactNode;
        targetId?: string;
    }) => (
        <a
            href={href}
            onClick={(e) => targetId && handleSmoothScroll(e, targetId)}
            className="flex items-center gap-2 text-white hover:text-emerald-200 font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
        >
            {icon}
            {children}
        </a>
    );

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-500 ${
                scrolled
                    ? "py-2 bg-gradient-to-r from-green-900 to-emerald-900 shadow-2xl backdrop-blur-sm bg-opacity-95"
                    : "py-4 bg-gradient-to-r from-green-800 to-emerald-800"
            }`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Logo amélioré */}
                    <motion.div
                        className="flex items-center space-x-3 cursor-pointer group"
                        onClick={() => router.push("/")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <FaHome className="text-emerald-600 text-xl" />
                        </div>
                        <div>
            <span className="text-xl font-bold text-white bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                ModerneMeuble
            </span>
                            <p className="text-xs text-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Excellence depuis 2024
                            </p>
                        </div>
                    </motion.div>

                    {/* Desktop menu amélioré */}
                    <div className="hidden lg:flex items-center space-x-1">
                        <NavLink href="#products" targetId="products" icon={<FaStore className="text-sm" />}>
                            Nos Produits
                        </NavLink>
                        <NavLink href="#about" targetId="about" icon={<FaInfoCircle className="text-sm" />}>
                            À Propos
                        </NavLink>
                        <NavLink href="#contact" targetId="contact" icon={<FaEnvelope className="text-sm" />}>
                            Contact
                        </NavLink>

                        {loading ? (
                            <div className="w-32 h-10 bg-emerald-700 rounded-xl animate-pulse" />
                        ) : isAuthenticated ? (
                            <div className="relative" ref={profileMenuRef}>
                                {/* Bouton profil avec animations */}
                                <motion.button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    onMouseEnter={() => setIsHoveringProfile(true)}
                                    onMouseLeave={() => setIsHoveringProfile(false)}
                                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 border border-white/20"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="relative">
                                        <FaUser className="text-lg" />
                                        {cartCount > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                                            >
                                                {cartCount}
                                            </motion.span>
                                        )}
                                    </div>
                                    <span className="font-medium max-w-32 truncate">
                                        {session?.user?.name || "Mon Profil"}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: showProfileMenu ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FaChevronDown className="text-sm" />
                                    </motion.div>
                                </motion.button>

                                {/* Menu dropdown profil */}
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute top-14 right-0 bg-white rounded-2xl shadow-2xl py-3 w-64 border border-gray-100 z-50"
                                        >
                                            {/* En-tête du profil */}
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="font-semibold text-gray-900 truncate">
                                                    {session?.user?.name || "Utilisateur"}
                                                </p>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {session?.user?.email}
                                                </p>
                                            </div>

                                            {/* Options du menu */}
                                            <div className="py-2">
                                                <motion.button
                                                    whileHover={{ x: 4 }}
                                                    onClick={() => { router.push("/ui/MyProfile"); setShowProfileMenu(false); }}
                                                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                >
                                                    <FaUser className="text-emerald-600" />
                                                    <span>Mon profil</span>
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ x: 4 }}
                                                    onClick={() => { router.push("/ui/myOrders"); setShowProfileMenu(false); }}
                                                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                >
                                                    <FaBoxOpen className="text-blue-600" />
                                                    <span>Mes commandes</span>
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ x: 4 }}
                                                    onClick={() => { router.push("/cart"); setShowProfileMenu(false); }}
                                                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                >
                                                    <div className="relative">
                                                        <FaShoppingCart className="text-purple-600" />
                                                        {cartCount > 0 && (
                                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                                                {cartCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span>Panier ({cartCount})</span>
                                                </motion.button>
                                            </div>

                                            <div className="border-t border-gray-100 pt-2">
                                                <motion.button
                                                    whileHover={{ x: 4 }}
                                                    onClick={handleLogoutClick}
                                                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <FaSignOutAlt />
                                                    <span>Déconnexion</span>
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.button
                                onClick={() => router.push("/auth/login")}
                                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaShieldAlt />
                                Espace Pro
                            </motion.button>
                        )}
                    </div>

                    {/* Mobile menu amélioré */}
                    <div className="lg:hidden">
                        <motion.button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white focus:outline-none w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            whileTap={{ scale: 0.9 }}
                        >
                            {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                        </motion.button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="absolute top-full left-0 w-full bg-gradient-to-b from-emerald-900 to-green-900 shadow-2xl z-40 overflow-hidden"
                                >
                                    <div className="flex flex-col p-6 space-y-4">
                                        <NavLink href="#products" targetId="products" icon={<FaStore />}>
                                            Nos Produits
                                        </NavLink>
                                        <NavLink href="#about" targetId="about" icon={<FaInfoCircle />}>
                                            À Propos
                                        </NavLink>
                                        <NavLink href="#contact" targetId="contact" icon={<FaEnvelope />}>
                                            Contact
                                        </NavLink>

                                        {isAuthenticated ? (
                                            <>
                                                <div className="border-t border-emerald-600 pt-4 mt-2">
                                                    <p className="text-emerald-200 text-sm font-medium px-3 mb-2">
                                                        Mon compte
                                                    </p>
                                                    <button
                                                        onClick={() => { router.push("/ui/MyProfile"); setIsOpen(false); }}
                                                        className="flex items-center gap-3 w-full px-3 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <FaUser />
                                                        Mon Profil
                                                    </button>
                                                    <button
                                                        onClick={() => { router.push("/ui/myOrders"); setIsOpen(false); }}
                                                        className="flex items-center gap-3 w-full px-3 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <FaBoxOpen />
                                                        Mes Commandes
                                                    </button>
                                                    <button
                                                        onClick={() => { router.push("/cart"); setIsOpen(false); }}
                                                        className="flex items-center gap-3 w-full px-3 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <div className="relative">
                                                            <FaShoppingCart />
                                                            {cartCount > 0 && (
                                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                                                    {cartCount}
                                                                </span>
                                                            )}
                                                        </div>
                                                        Panier ({cartCount})
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => { handleLogoutClick(); setIsOpen(false); }}
                                                    className="flex items-center gap-3 w-full px-3 py-3 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors mt-4 border border-red-500/30"
                                                >
                                                    <FaSignOutAlt />
                                                    Déconnexion
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => { router.push("/auth/login"); setIsOpen(false); }}
                                                className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-3 rounded-lg font-semibold text-center mt-4 flex items-center justify-center gap-2"
                                            >
                                                <FaShieldAlt />
                                                Espace Pro
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>

            {/* Espace pour le contenu sous la navbar fixe */}
            <div className={`transition-all duration-300 ${scrolled ? "h-16" : "h-20"}`} />

            {/* Modal de déconnexion */}
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