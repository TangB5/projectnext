"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "@/app/lib/authProvider";

export function Navbar() {
    const { session, isAuthenticated, loading, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const router = useRouter();
    const profileMenuRef = useRef<HTMLDivElement>(null);
const API_BASE_URL=process.env.NEXT_PUBLIC_BACKEND_URL;
    // -----------------------------
    // Fermer dropdown si click à l'extérieur
    // -----------------------------
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
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
    // Scroll effect
    // -----------------------------
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // -----------------------------
    // Panier dynamique (utilise ton contrôleur backend)
    // -----------------------------
    useEffect(() => {
        if (!isAuthenticated) {
            setCartCount(0);
            return;
        }

        const fetchCartCount = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}api/orders/cart/count`, { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    setCartCount(data.count || 0);
                }
            } catch (err) {
                console.error("Erreur récupération panier :", err);
            }
        };

        fetchCartCount();
    }, [isAuthenticated]);

    const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            setIsOpen(false);
        }
    };

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

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "py-2 bg-green-900 shadow-xl" : "py-3 bg-green-800"}`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
                        <span className="text-xl font-bold text-white">ModerneMeuble</span>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a
                            href="#products"
                            onClick={(e) => handleSmoothScroll(e, "products")}
                            className="text-white hover:text-stone-200 font-medium"
                        >
                            Nos Produits
                        </a>
                        <a
                            href="#about"
                            onClick={(e) => handleSmoothScroll(e, "about")}
                            className="text-white hover:text-stone-200 font-medium"
                        >
                            À Propos
                        </a>
                        <a
                            href="#contact"
                            onClick={(e) => handleSmoothScroll(e, "contact")}
                            className="text-white hover:text-stone-200 font-medium"
                        >
                            Contact
                        </a>

                        {loading ? (
                            <div className="w-24 h-8 bg-gray-600 rounded-lg animate-pulse" />
                        ) : isAuthenticated ? (
                            <div className="relative" ref={profileMenuRef}>
                                {/* Profil avec badge panier */}
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="text-white hover:text-stone-200 flex items-center gap-2 relative"
                                >
                                    <i className="pi pi-user text-xl" />
                                    {session?.user?.name || "Mon Profil"}
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {cartCount}
          </span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-10 right-0 bg-white rounded-lg shadow-lg py-2 w-48 text-gray-800 z-10"
                                        >
                                            <button
                                                onClick={() => router.push("/ui/MyProfile")}
                                                className="block w-full px-4 py-2 hover:bg-gray-100 flex items-center"
                                            >
                                                Mon profil
                                            </button>
                                            <button
                                                onClick={() => router.push("/ui/myOrders")}
                                                className="block w-full px-4 py-2 hover:bg-gray-100 flex items-center"
                                            >
                                                Mes commandes
                                            </button>
                                            <hr className="my-1 border-gray-200" />
                                            <button
                                                onClick={handleLogoutClick}
                                                className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 flex items-center"
                                            >
                                                Déconnexion
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={() => router.push("/auth/login")}
                                className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
                            >
                                Espace Pro
                            </button>
                        )}
                    </div>

                    {/* Mobile menu */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                            <i className={`pi ${isOpen ? "pi-times" : "pi-bars"} text-2xl`}></i>
                        </button>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 w-full bg-green-800 z-40 overflow-hidden"
                                >
                                    <div className="flex flex-col p-4 space-y-2">
                                        <a href="#products" onClick={(e) => { handleSmoothScroll(e, "products"); setIsOpen(false); }} className="text-white hover:text-stone-200 font-medium">Nos Produits</a>
                                        <a href="#about" onClick={(e) => { handleSmoothScroll(e, "about"); setIsOpen(false); }} className="text-white hover:text-stone-200 font-medium">À Propos</a>
                                        <a href="#contact" onClick={(e) => { handleSmoothScroll(e, "contact"); setIsOpen(false); }} className="text-white hover:text-stone-200 font-medium">Contact</a>

                                        {isAuthenticated ? (
                                            <>
                                                <button onClick={() => { router.push("/cart"); setIsOpen(false); }} className="text-white flex items-center gap-2">
                                                    Panier ({cartCount})
                                                </button>
                                                <button onClick={() => { router.push("/profile"); setIsOpen(false); }} className="text-white flex items-center gap-2">
                                                    Mon Profil
                                                </button>
                                                <button onClick={() => { handleLogoutClick(); setIsOpen(false); }} className="text-red-400 flex items-center gap-2">
                                                    Déconnexion
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => { router.push("/auth/login"); setIsOpen(false); }} className="bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-center">
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
        </>
    );
}
