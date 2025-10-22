"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import { LogoutConfirmModal } from "@/app/ui/component/modals/LogoutConfirmModal";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "@/app/lib/authProvider";
import {
    FaUser, FaBoxOpen, FaSignOutAlt,
    FaBars, FaTimes, FaChevronDown, FaHome, FaInfoCircle,
    FaEnvelope, FaStore, FaShieldAlt// Import de l'icône du panier (bien qu'on utilise FaBoxOpen pour les commandes)
} from 'react-icons/fa';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/";

const DropdownItem = ({ icon, label, onClick, badgeCount }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    badgeCount?: number; // Ajout du prop pour le compteur
}) => (
    <button
        onClick={onClick}
        className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors rounded-lg text-left"
    >
        <span className="flex items-center gap-3">
            {icon}
            <span className="font-medium">{label}</span>
        </span>
        {/* Affichage du badge si le compteur est présent et > 0 */}
        {badgeCount !== undefined && badgeCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center">
                {badgeCount}
            </span>
        )}
    </button>
);


export function Navbar() {
    const { session, isAuthenticated, loading, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const router = useRouter();
    const pathname = usePathname();
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // -----------------------------
    // Gestion clic à l'extérieur du dropdown profil
    // -----------------------------
    useEffect(() => {
        const handleClickOutside = (event: Event) => {
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
    // Effet scroll pour navbar
    // -----------------------------
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // -----------------------------
    // Panier dynamique (Correction de la logique et du cache)
    // -----------------------------
    const fetchCartCount = async () => {
        if (!isAuthenticated || !session?.token) {
            setCartCount(0);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}api/orders/cart/count`, {
                headers: {
                    Authorization: `Bearer ${session.token}`,
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            });

            if (res.ok) {
                const data = await res.json();

                setCartCount(data.count && typeof data.count === 'number' ? data.count : 0);
            } else {
                console.warn("Impossible de récupérer le panier, statut:", res.status);
                setCartCount(0);
            }
        } catch (err) {
            console.error("Erreur récupération panier :", err);
            setCartCount(0);
        }
    };

    useEffect(() => {
        fetchCartCount();
        const interval = setInterval(fetchCartCount, 30000); // Rafraîchit toutes les 30 secondes
        return () => clearInterval(interval);
    }, [isAuthenticated, session?.token]);

    // -----------------------------
    // Smooth scroll pour les liens
    // -----------------------------
    const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        if (pathname === "/") {
            const element = document.getElementById(targetId);
            if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            router.push(`/#${targetId}`);
        }
        setIsOpen(false);
    };

    // -----------------------------
    // Déconnexion
    // -----------------------------
    const handleLogoutClick = () => setShowLogoutModal(true);

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

    // -----------------------------
    // Navigation profil
    // -----------------------------
    const handleProfileNavigation = (path: string) => {
        setShowProfileMenu(false);
        router.push(path);
    };

    // -----------------------------
    // Composant NavLink
    // -----------------------------
    const NavLink = ({
                         href,
                         children,
                         icon,
                         targetId,
                     }: {
        href: string;
        children: React.ReactNode;
        icon?: React.ReactNode;
        targetId?: string;
    }) => (
        <a
            href={href}
            onClick={(e) => targetId && handleSmoothScroll(e, targetId)}
            className="flex items-center gap-2 text-white hover:text-emerald-200 font-medium transition-all duration-200 px-3 py-2 rounded-lg"
        >
            {icon} {children}
        </a>
    );

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled

                    ? "py-2 bg-gradient-to-r from-emerald-900 to-emerald-600 shadow-2xl backdrop-blur-sm bg-opacity-90"

                    : "py-3 bg-transparent"
            }`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Logo */}
                    <motion.div className="flex items-center space-x-3 cursor-pointer group" onClick={() => router.push("/")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <FaHome className="text-emerald-600 text-xl" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200">
                                ModerneMeuble
                            </span>
                            <p className="text-xs text-emerald-300">
                                Meubles & Décoration
                            </p>
                        </div>
                    </motion.div>

                    {/* Menu Desktop */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <NavLink href="#products" targetId="products" icon={<FaStore className="text-base" />}>Nos Produits</NavLink>
                        <NavLink href="#about" targetId="about" icon={<FaInfoCircle className="text-base" />}>À Propos</NavLink>
                        <NavLink href="#contact" targetId="contact" icon={<FaEnvelope className="text-base" />}>Contact</NavLink>

                        {loading ? (
                            <div className="w-40 h-10 bg-emerald-700/50 rounded-xl animate-pulse ml-4" />
                        ) : isAuthenticated ? (
                            <div className="relative ml-4" ref={profileMenuRef}>
                                {/* Bouton profil amélioré */}
                                <motion.button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-white transition-all duration-200" whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.98 }}>
                                    <FaUser className="text-lg text-emerald-300" />
                                    <span className="font-semibold max-w-24 truncate">{session?.user?.name || "Mon Profil"}</span>
                                    <motion.div animate={{ rotate: showProfileMenu ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                        <FaChevronDown className="text-sm text-emerald-300" />
                                    </motion.div>
                                </motion.button>

                                {/* Menu dropdown profil */}
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }} className="absolute top-12 right-0 bg-white rounded-xl shadow-2xl py-2 w-64 border border-gray-100 z-50 origin-top-right">
                                            {/* Info de l'utilisateur */}
                                            <div className="px-4 pb-2 border-b border-gray-100 mb-1">
                                                <p className="text-sm font-semibold text-gray-800 truncate">
                                                    {session?.user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {session?.user?.email}
                                                </p>
                                            </div>

                                            {/* Options de navigation */}
                                            <DropdownItem
                                                icon={<FaUser className="text-lg text-emerald-500" />}
                                                label="Mon Profil"
                                                onClick={() => handleProfileNavigation("/ui/MyProfile")}
                                            />
                                            {/* AFFICHE LE COMPTEUR DU PANIER À CÔTÉ DES COMMANDES */}
                                            <DropdownItem
                                                icon={<FaBoxOpen className="text-lg text-emerald-500" />}
                                                label="Mes Commandes"
                                                onClick={() => handleProfileNavigation("/ui/myOrders")}
                                                badgeCount={cartCount}
                                            />


                                            <div className="border-t border-gray-100 mt-2 pt-2 mx-2">
                                                {/* Option Déconnexion */}
                                                <DropdownItem
                                                    icon={<FaSignOutAlt className="text-lg text-red-500" />}
                                                    label="Déconnexion"
                                                    onClick={handleLogoutClick}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.button onClick={() => router.push("/auth/login")} className="bg-white text-emerald-600 px-6 py-2 rounded-xl font-bold shadow-lg transition-all duration-200 flex items-center gap-2 ml-4" whileHover={{ scale: 1.05, boxShadow: "0 8px 15px rgba(255, 255, 255, 0.2)" }} whileTap={{ scale: 0.95 }}>
                                <FaShieldAlt className="text-sm" /> Espace Pro
                            </motion.button>
                        )}
                    </div>

                    {/* Mobile menu (Mise à jour pour inclure le compteur) */}
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
                                    className="absolute top-full left-0 w-full bg-gradient-to-b from-gray-900 to-emerald-900 shadow-2xl z-40 overflow-hidden"
                                >
                                    <div className="flex flex-col p-6 space-y-4">
                                        <NavLink href="#products" targetId="products" icon={<FaStore />}>Nos Produits</NavLink>
                                        <NavLink href="#about" targetId="about" icon={<FaInfoCircle />}>À Propos</NavLink>
                                        <NavLink href="#contact" targetId="contact" icon={<FaEnvelope />}>Contact</NavLink>

                                        {isAuthenticated && (
                                            <>
                                                <div className="border-t border-emerald-600 pt-4 mt-2">
                                                    <p className="text-emerald-200 text-sm font-medium px-3 mb-2">Mon compte</p>
                                                    <button
                                                        onClick={() => { router.push("/ui/MyProfile"); setIsOpen(false); }}
                                                        className="flex items-center gap-3 w-full px-3 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <FaUser /> Mon Profil
                                                    </button>
                                                    <button
                                                        onClick={() => { router.push("/ui/myOrders"); setIsOpen(false); }}
                                                        className="flex items-center justify-between w-full px-3 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <span className="flex items-center gap-3">
                                                            <FaBoxOpen /> Mes Commandes
                                                        </span>
                                                        {cartCount > 0 && ( // Ajout du badge mobile
                                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center">
                                                                {cartCount}
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => { handleLogoutClick(); setIsOpen(false); }}
                                                    className="flex items-center gap-3 w-full px-3 py-3 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors mt-4 border border-red-500/30"
                                                >
                                                    <FaSignOutAlt /> Déconnexion
                                                </button>
                                            </>
                                        )}
                                        {!isAuthenticated && (
                                            <button
                                                onClick={() => { router.push("/auth/login"); setIsOpen(false); }}
                                                className="bg-white text-emerald-600 px-4 py-3 rounded-lg font-semibold text-center mt-4 flex items-center justify-center gap-2"
                                            >
                                                <FaShieldAlt /> Espace Pro
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>



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