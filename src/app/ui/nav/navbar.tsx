"use client";

import { useState, useEffect, MouseEvent } from "react";
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

  useEffect(() => {
    setCartCount(isAuthenticated ? 3 : 0);
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

  const handleExploreCatalog = () => {
    setShowLogoutModal(false);
    router.push("/products");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "py-2 bg-green-900 shadow-xl" : "py-3 bg-green-800"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" className="text-white">
                <path
                  fill="currentColor"
                  d="M20 9V7c0-1.65-1.35-3-3-3H7C5.35 4 4 5.35 4 7v2c-1.65 0-3 1.35-3 3v5c0 1.65 1.35 3 3 3v1c0 .55.45 1 1 1s1-.45 1-1v-1h12v1c0 .55.45 1 1 1s1-.45 1-1v-1c1.65 0 3-1.35 3-3v-5c0-1.65-1.35-3-3-3zM6 7c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v2.78c-.61.55-1 1.34-1 2.22v2H7v-2c0-.88-.39-1.67-1-2.22V7zm15 10c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v-5c0-.55.45-1 1-1s1 .45 1 1v4h14v-4c0-.55.45-1 1-1s1 .45 1 1v5z"
                />
              </svg>
              <span className="text-xl font-bold text-white">ModerneMeuble</span>
            </div>

            {/* Menu desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#products" onClick={(e) => handleSmoothScroll(e, "products")} className="text-white hover:text-stone-200 font-medium">
                Nos Produits
              </a>
              <a href="#about" onClick={(e) => handleSmoothScroll(e, "about")} className="text-white hover:text-stone-200 font-medium">
                À Propos
              </a>
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, "contact")} className="text-white hover:text-stone-200 font-medium">
                Contact
              </a>

              {loading ? (
                <div className="w-24 h-8 bg-gray-600 rounded-lg animate-pulse" />
              ) : isAuthenticated ? (
                <>
                  <button
                    onClick={() => router.push("/cart")}
                    className="relative text-white hover:text-stone-200"
                  >
                    <i className="pi pi-shopping-cart text-xl" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="text-white hover:text-stone-200 flex items-center gap-2"
                    >
                      <i className="pi pi-user text-xl" />
                      {session?.user?.name || "Mon Profil"}
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
                            onClick={() => {
                              setShowProfileMenu(false);
                              router.push("/profile");
                            }}
                            className="block w-full px-4 py-2 hover:bg-gray-100 flex items-center"
                          >
                            <i className="pi pi-user mr-2" /> Mon profil
                          </button>
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              router.push("/my-orders");
                            }}
                            className="block w-full px-4 py-2 hover:bg-gray-100 flex items-center"
                          >
                            <i className="pi pi-list mr-2" /> Mes commandes
                          </button>
                          <hr className="my-1 border-gray-200" />
                          <button
                            onClick={handleLogoutClick}
                            className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 flex items-center"
                          >
                            <i className="pi pi-power-off mr-2" /> Déconnexion
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => router.push("/auth/login")}
                  className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Espace Pro
                </button>
              )}
            </div>

            {/* Bouton menu mobile */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                <i className={`pi ${isOpen ? "pi-times" : "pi-bars"} text-2xl`}></i>
              </button>
            </div>
          </div>

          {/* Menu mobile */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 py-4" : "max-h-0"}`}>
            <div className="flex flex-col space-y-4 mt-4">
              <a href="#products" onClick={(e) => handleSmoothScroll(e, "products")} className="text-white hover:text-stone-200 font-medium px-2 py-1">
                Nos Produits
              </a>
              <a href="#about" onClick={(e) => handleSmoothScroll(e, "about")} className="text-white hover:text-stone-200 font-medium px-2 py-1">
                À Propos
              </a>
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, "contact")} className="text-white hover:text-stone-200 font-medium px-2 py-1">
                Contact
              </a>

              {loading ? (
                <div className="w-full h-10 bg-gray-600 rounded-lg animate-pulse" />
              ) : isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      router.push("/cart");
                      setIsOpen(false);
                    }}
                    className="text-white hover:text-stone-200 font-medium px-2 py-1 flex items-center"
                  >
                    <i className="pi pi-shopping-cart mr-2" />
                    Panier ({cartCount})
                  </button>
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setIsOpen(false);
                    }}
                    className="text-white hover:text-stone-200 font-medium px-2 py-1 flex items-center"
                  >
                    <i className="pi pi-user mr-2" />
                    Mon Profil
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left text-red-400 hover:text-red-300 font-medium px-2 py-1 flex items-center"
                  >
                    <i className="pi pi-power-off mr-2" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push("/auth/login")}
                  className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-center font-medium mt-2"
                >
                  Espace Pro
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 mx-2"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mr-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Oh là là, vous nous quittez déjà ?</h3>
                  <p className="text-gray-600 mb-4">
                    Avez-vous eu le temps de visiter notre nouveau catalogue ? Nous avons ajouté des pièces exclusives qui pourraient vous plaire !
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleExploreCatalog}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <i className="pi pi-eye"></i>
                      Voir le catalogue
                    </button>
                    <button
                      onClick={handleLogoutCancel}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Rester connecté
                    </button>
                  </div>
                  <button
                    onClick={handleLogoutConfirm}
                    className="mt-3 w-full text-center text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Non merci, je veux vraiment me déconnecter
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
