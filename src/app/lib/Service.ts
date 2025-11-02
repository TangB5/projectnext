import { Product, Order, ProductData, OrderItem } from "../types";
import {ContactFormData} from "@/app/lib/type";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// ---------- AUTH HELPERS ----------


function getAuthHeaders(): Record<string, string> {
    return { "Content-Type": "application/json" };
}

// ---------- AUTHENTIFICATION ----------

export interface LoginResponse {
    user: {
        id: string;
        name: string;
        email: string;
        roles?: string[];
    };
    message?: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {

    try {
        const res = await fetch('/api/auth/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.message || "Échec de la connexion.");
        }

        if (!data.user) {
            throw new Error("Utilisateur non trouvé dans la réponse du serveur.");
        }


        return data;
    } catch (error: unknown) {

        if (error instanceof Response) {
            if (error.status === 401) {
                throw new Error("Identifiants invalides.");
            }
            throw new Error(`Erreur serveur (${error.status})`);
        }


        if (error instanceof Error) {
            console.error("Erreur login:", error);
            throw new Error(error.message || "Erreur de connexion au serveur.");
        }


        console.error("Erreur inconnue:", error);
        throw new Error("Une erreur inattendue est survenue.");
    }

}

// ---------- UTILITAIRES ----------
export async function isAdminClient(): Promise<boolean> {
    try {
        const res = await fetch("/api/auth/me", {
            credentials: "include",
        });

        if (!res.ok) return false;

        const data = await res.json();
        const roles = data?.user?.roles || [];
        return Array.isArray(roles) && roles.includes("admin");
    } catch (err) {
        console.error("Erreur vérification admin:", err);
        return false;
    }
}



// ---------- PRODUITS ----------

interface ProductsResponse {
    products: Product[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
}

export async function getProducts(page: number = 1): Promise<ProductsResponse> {

    const res = await fetch(`${API_BASE_URL}api/products?page=${page}`, {
        cache: "no-store",
        credentials: "include",
    });

    if (!res.ok) throw new Error("Erreur chargement produits");

    return res.json();
}

export async function createProduct(data: ProductData): Promise<Product> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`${API_BASE_URL}api/products`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!res.ok) throw new Error("Erreur création produit");
    return res.json();
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`${API_BASE_URL}api/products/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!res.ok) throw new Error("Erreur mise à jour produit");
    return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`${API_BASE_URL}api/products/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
    });

    if (!res.ok) throw new Error("Erreur suppression produit");
}

// ---------- COMMANDES ADMIN ----------
export async function getAllOrders(page = 1, limit = 10): Promise<{ orders: Order[]; total: number }> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`${API_BASE_URL}api/orders?page=${page}&limit=${limit}`, {
        cache: "no-store",
        credentials: "include",
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur chargement commandes");
    }

    return res.json();
}


type OrderUpdateFields = {
    status?: Order["status"];
    paymentMethod?: string;
};

export async function updateOrderStatus(
    id: string,
    updateFields: OrderUpdateFields
): Promise<Order> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`${API_BASE_URL}api/orders/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateFields),
        credentials: "include",
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur mise à jour commande");
    }

    return res.json();
}


export async function deleteOrder(id: string): Promise<void> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`${API_BASE_URL}api/orders/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur suppression commande");
    }
}

// ---------- COMMANDES UTILISATEUR ----------
export async function createOrder(
    userId: string,
    items: OrderItem[],
    paymentMethod?: string,
    orderDetails?: object
): Promise<Order> {
    const res = await fetch(`${API_BASE_URL}api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items, paymentMethod, details: orderDetails  }),
        credentials: "include",
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Erreur création commande");
    }

    return res.json();
}

export async function getMyOrders(): Promise<Order[]> {
    const token = localStorage.getItem("jwt_token");
    if (!token) throw new Error("Non autorisé");

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload._id;

    const res = await fetch(`${API_BASE_URL}api/orders/user/${userId}`, {
        cache: "no-store",
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur chargement commandes");
    }
    return res.json();
}


// ------------------------------
// 👤 Récupère l'utilisateur courant
// ------------------------------
export async function getCurrentUser(): Promise<{ id: string; name: string; email: string; roles?: string[] } | null> {
    try {
        const res = await fetch(`${API_BASE_URL}api/auth/me`, {
            credentials: "include", //
            cache: "no-store",
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data?.user || null;
    } catch (err) {
        console.error("Erreur getCurrentUser:", err);
        return null;
    }
}


// ------------------------------
// 👥 Récupère tous les utilisateurs (admin only)
// ------------------------------
export async function getAllUsers(): Promise<{ id: string; name: string; email: string; roles?: string[] }[]> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`${API_BASE_URL}api/users`, {
        cache: "no-store",
        credentials: "include",
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Erreur chargement utilisateurs");
    }

    return res.json();
}

// ------------------------------
// ➕ Créer un utilisateur (admin only)
// ------------------------------
export async function createUser(data: { name: string; email: string; password: string; role?: string }) {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`${API_BASE_URL}api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur création utilisateur");
    }

    return res.json();
}

// ------------------------------
// ✏️ Met à jour un utilisateur (admin only)
// ------------------------------
export async function updateUser(id: string, data: Partial<{ name: string; email: string; password: string; role?: string }>) {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`${API_BASE_URL}api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur mise à jour utilisateur");
    }

    return res.json();
}

// ------------------------------
// ❌ Supprime un utilisateur (admin only)
// ------------------------------
export async function deleteUser(id: string): Promise<void> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`${API_BASE_URL}api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur suppression utilisateur");
    }
}

// ------------------------------
// 🚪 Déconnexion (supprime cookie côté backend)
// ------------------------------
export async function logout() {
    try {
        await fetch(`${API_BASE_URL}api/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
    } catch (err) {
        console.error("Erreur logout:", err);
    }

    return { success: true };
}



export interface GeneralSettings {
    storeName: string;
    email: string;
    phone: string;
    address: string;
    currency: string;
    maintenance: boolean;
}

export interface PaymentMethod {
    id: string;
    name: string;
    enabled: boolean;
    description: string;
    isMobileMoney: boolean;
}

export interface ShippingZone {
    id: string;
    name: string;
    cost: number;
    enabled: boolean;
}

export interface NotificationSettings {
    newOrderEmail: boolean;
    lowStockAlert: boolean;
    paymentFailureSMS: boolean;
}

export interface Settings {
    general: GeneralSettings;
    payments: PaymentMethod[];
    shipping: ShippingZone[];
    notifications: NotificationSettings;
}

// ==================== GET SETTINGS ====================

export async function getSettingsAdmin(): Promise<Settings> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`${API_BASE_URL}api/settings`, {
        cache: "no-store",
        credentials: "include",
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Erreur chargement paramètres");
    }

    return res.json();
}

// ==================== UPDATE SETTINGS (GÉNÉRIQUE) ====================

export async function updateSettingsAdmin<K extends keyof Settings>(
    settingKey: K,
    data: Settings[K]
): Promise<{ message: string } & { [P in K]: Settings[P] }> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`${API_BASE_URL}api/settings/${settingKey}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur mise à jour paramètres ${String(settingKey)}`);
    }

    return res.json();
}

// ==================== FONCTIONS SPÉCIFIQUES ====================

// --- Général ---
export async function updateGeneralSettingsAdmin(
    data: GeneralSettings
): Promise<{ message: string; general: GeneralSettings }> {
    return updateSettingsAdmin("general", data);
}

// --- Paiements ---
export async function updatePaymentSettingsAdmin(
    data: PaymentMethod[]
): Promise<{ message: string; payments: PaymentMethod[] }> {
    return updateSettingsAdmin("payments", data);
}

// --- Livraison ---
export async function updateShippingSettingsAdmin(
    data: ShippingZone[]
): Promise<{ message: string; shipping: ShippingZone[] }> {
    return updateSettingsAdmin("shipping", data);
}

// --- Notifications ---
export async function updateNotificationSettingsAdmin(
    data: NotificationSettings
): Promise<{ message: string; notifications: NotificationSettings }> {
    return updateSettingsAdmin("notifications", data);
}

export async function getContactInfo() {
    try {
        const res = await fetch(`${API_BASE_URL}api/contact`, { cache: "no-store" });
        if (!res.ok) throw new Error("Erreur lors de la récupération du contact");
        return await res.json();
    } catch (error) {
        console.error("❌ getContactInfo:", error);
        throw error;
    }
}

/**
 * 🔹 Envoie un message via le formulaire de contact
 * @param {Object} data - Données du formulaire
 */
export async function sendContactMessage(data: ContactFormData) {
    try {
        const res = await fetch(`${API_BASE_URL}api/contact/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Erreur lors de l’envoi du message");

        return result;
    } catch (error) {
        console.error("❌ sendContactMessage:", error);
        throw error;
    }
}