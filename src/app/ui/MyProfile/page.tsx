"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/lib/authProvider";
import toast from "react-hot-toast";
import Image from "next/image";
import {User} from "@/app/types"
// Import des icônes PrimeIcons
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCity,
    FaMapPin,
    FaGlobe,
    FaBell,
    FaShieldAlt,
    FaSignOutAlt,
    FaCamera,
    FaCalendarAlt,
    FaBox,
    FaStar,
    FaSave,
    FaLock,
    FaKey
} from 'react-icons/fa';



export default function MyProfilePage() {
    const {  isAuthenticated, loading, logout, updateProfile,user } = useAuth();
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<User>({
        name: "",
        email: "",
        phone: "",
        avatar: "",
        address: {
            street: "",
            city: "",
            postalCode: "",
            country: ""
        },
        preferences: {
            newsletter: true,
            smsNotifications: false,
            emailNotifications: true
        }
    });

    const stats = [
        {
            title: "Membre depuis",
            value: user?.createdAt
                ? new Date(user.createdAt).getFullYear().toString()
                : "-",
            icon: <FaCalendarAlt className="text-xl" />
        },
        {
            title: "Commandes",
            value: user?.orderCount?.toString() || "0",
            icon: <FaBox className="text-xl" />
        },
        {
            title: "Fidélité",
            value: user?.loyaltyTier || "Bronze",
            icon: <FaStar className="text-xl" />
        },
        // Tu peux ajouter d'autres stats ici si nécessaire
    ];



    useEffect(() => {
        if (isAuthenticated && user) {
            setProfile(prev => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                avatar: user.avatar || "",
                address: user.address || prev.address,
                preferences: user.preferences || prev.preferences
            }));
        }
    }, [isAuthenticated, user]);

    const handleUpdateProfile = async () => {
        setUpdating(true);
        try {
            await updateProfile(profile);
            toast.success("Profil mis à jour avec succès !", {
                style: {
                    background: '#10b981',
                    color: '#fff',
                },
                icon: '✅'
            });
        } catch (err) {
            console.error(err);
            toast.error("Impossible de mettre à jour le profil", {
                style: {
                    background: '#ef4444',
                    color: '#fff',
                },
                icon: '❌'
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Simuler l'upload d'avatar
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfile(prev => ({ ...prev, avatar: e.target?.result as string }));
                toast.success("Photo de profil mise à jour !", {
                    icon: '📸'
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            await logout();
        }
    };

    const StatsCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-gray-600 font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );

    const NavigationItem = ({ id, label, icon, isActive }: {
        id: string;
        label: string;
        icon: React.ReactNode;
        isActive: boolean;
    }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                isActive
                    ? "bg-green-500 text-white shadow-lg shadow-green-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
        >
            <span className="text-lg">{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 ">
                <div className="container mx-auto px-4 max-w-6xl ">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>
                            ))}
                        </div>
                        <div className="bg-white rounded-2xl p-8">
                            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated && !loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-sm border border-white">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaLock className="text-3xl text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
                    <p className="text-gray-600 text-lg">Veuillez vous connecter pour accéder à votre profil.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 pt-20">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* En-tête */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        Mon Profil
                    </h1>
                    <p className="text-xl text-gray-600 flex items-center justify-center gap-2">
                        <FaUser className="text-green-500" />
                        Gérez vos informations personnelles et préférences
                    </p>
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <StatsCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                        />
                    ))}
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Navigation latérale */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white p-6 sticky top-8">
                            {/* Avatar et nom */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block mb-4">
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 relative overflow-hidden border-4 border-white shadow-lg">
                                        {profile.avatar ? (
                                            <Image
                                                src={profile.avatar}
                                                alt="Profile"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white">
                                                <FaUser className="text-3xl" />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-colors"
                                    >
                                        <FaCamera className="text-sm" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleAvatarChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                                <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
                                    <FaEnvelope className="text-xs" />
                                    {profile.email}
                                </p>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2">
                                <NavigationItem
                                    id="profile"
                                    label="Informations personnelles"
                                    icon={<FaUser />}
                                    isActive={activeTab === "profile"}
                                />
                                <NavigationItem
                                    id="address"
                                    label="Adresse de livraison"
                                    icon={<FaMapMarkerAlt />}
                                    isActive={activeTab === "address"}
                                />
                                <NavigationItem
                                    id="preferences"
                                    label="Préférences"
                                    icon={<FaBell />}
                                    isActive={activeTab === "preferences"}
                                />
                                <NavigationItem
                                    id="security"
                                    label="Sécurité"
                                    icon={<FaShieldAlt />}
                                    isActive={activeTab === "security"}
                                />
                            </nav>
                        </div>
                    </div>

                    {/* Contenu principal */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white p-8">
                            {/* Informations personnelles */}
                            {activeTab === "profile" && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <FaUser className="text-green-500" />
                                        Informations personnelles
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <FaUser className="text-gray-400" />
                                                Nom complet
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Votre nom complet"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <FaEnvelope className="text-gray-400" />
                                                Adresse email
                                            </label>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                                placeholder="votre@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <FaPhone className="text-gray-400" />
                                                Téléphone
                                            </label>
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                                placeholder="+33 1 23 45 67 89"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Adresse */}
                            {activeTab === "address" && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <FaMapMarkerAlt className="text-green-500" />
                                        Adresse de livraison
                                    </h2>

                                    <div className="grid gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-gray-400" />
                                                Adresse
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.address?.street}
                                                onChange={(e) => setProfile(prev => ({
                                                    ...prev,
                                                    address: { ...prev.address!, street: e.target.value }
                                                }))}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="123 Rue de l'exemple"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                    <FaCity className="text-gray-400" />
                                                    Ville
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profile.address?.city}
                                                    onChange={(e) => setProfile(prev => ({
                                                        ...prev,
                                                        address: { ...prev.address!, city: e.target.value }
                                                    }))}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="Paris"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                    <FaMapPin className="text-gray-400" />
                                                    Code postal
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profile.address?.postalCode}
                                                    onChange={(e) => setProfile(prev => ({
                                                        ...prev,
                                                        address: { ...prev.address!, postalCode: e.target.value }
                                                    }))}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="75001"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <FaGlobe className="text-gray-400" />
                                                Pays
                                            </label>
                                            <input
                                                type="text"
                                                value={profile.address?.country}
                                                onChange={(e) => setProfile(prev => ({
                                                    ...prev,
                                                    address: { ...prev.address!, country: e.target.value }
                                                }))}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="France"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Préférences */}
                            {activeTab === "preferences" && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <FaBell className="text-green-500" />
                                        Préférences de communication
                                    </h2>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                id: "newsletter",
                                                label: "Newsletter",
                                                description: "Recevoir les offres spéciales et nouveautés",
                                                checked: profile.preferences?.newsletter,
                                                icon: <FaEnvelope className="text-blue-500" />
                                            },
                                            {
                                                id: "emailNotifications",
                                                label: "Notifications email",
                                                description: "Recevoir les confirmations de commande par email",
                                                checked: profile.preferences?.emailNotifications,
                                                icon: <FaBell className="text-green-500" />
                                            },
                                            {
                                                id: "smsNotifications",
                                                label: "Notifications SMS",
                                                description: "Recevoir les alertes de livraison par SMS",
                                                checked: profile.preferences?.smsNotifications,
                                                icon: <FaPhone className="text-purple-500" />
                                            }
                                        ].map((pref) => (
                                            <div key={pref.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        {pref.icon}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{pref.label}</p>
                                                        <p className="text-sm text-gray-600">{pref.description}</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={pref.checked}
                                                        onChange={(e) => setProfile(prev => ({
                                                            ...prev,
                                                            preferences: {
                                                                ...prev.preferences!,
                                                                [pref.id]: e.target.checked
                                                            }
                                                        }))}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sécurité */}
                            {activeTab === "security" && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <FaShieldAlt className="text-green-500" />
                                        Sécurité du compte
                                    </h2>

                                    <div className="space-y-4">
                                        <div className="p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <FaKey className="text-blue-500 text-xl" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">Changer le mot de passe</h3>
                                                    <p className="text-gray-600 text-sm">Mettez à jour votre mot de passe régulièrement</p>
                                                </div>
                                            </div>
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
                                                <FaKey className="text-sm" />
                                                Changer le mot de passe
                                            </button>
                                        </div>

                                        <div className="p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <FaShieldAlt className="text-green-500 text-xl" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">Authentification à deux facteurs</h3>
                                                    <p className="text-gray-600 text-sm">Protégez votre compte avec une sécurité renforcée</p>
                                                </div>
                                            </div>
                                            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
                                                <FaShieldAlt className="text-sm" />
                                                Activer la 2FA
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-200">
                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={updating}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-green-200 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {updating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Mise à jour...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="text-lg" />
                                            Enregistrer les modifications
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="px-8 py-4 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-3"
                                >
                                    <FaSignOutAlt />
                                    Se déconnecter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}