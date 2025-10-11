// src/app/lib/apiHelpers.client.ts
import { Product, Order, ProductData, OrderItem } from "../types";

const API_BASE_URL = "";

export async function isAdminClient(): Promise<boolean> {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    if (!res.ok) return false;
    const session = await res.json();
    return session?.user?.roles?.includes("admin") ?? false;
}

// ---------- PRODUITS ----------
export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE_URL}/api/products`, { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur chargement produits");
    return res.json();
}

export async function createProduct(data: ProductData): Promise<Product> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");
    const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur création produit");
    return res.json();
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");
    const res = await fetch(`${API_BASE_URL}/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur mise à jour produit");
    return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");
    const res = await fetch(`${API_BASE_URL}/api/product/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur suppression produit");
}

// ---------- COMMANDES ADMIN ----------
export async function getAllOrders(page = 1, limit = 10): Promise<{ orders: Order[], total: number }> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`/api/orders?page=${page}&limit=${limit}`, { cache: "no-store" });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur chargement commandes");
    }
    return res.json(); // { orders, total }
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur mise à jour commande");
    }
    return res.json();
}

export async function deleteOrder(id: string): Promise<void> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur suppression commande");
    }
}

// ---------- COMMANDES UTILISATEUR ----------
export async function createOrder(userId: string, items: OrderItem[], paymentMethod?: string, details?: object): Promise<Order> {
    const res = await fetch(`/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items, paymentMethod, details }),
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur création commande");
    }
    return res.json();
}

export async function getMyOrders(): Promise<Order[]> {
    const resSession = await fetch("/api/auth/session", { cache: "no-store" });
    if (!resSession.ok) throw new Error("Erreur session");

    const session = await resSession.json();
    if (!session?.user?.id) throw new Error("Non autorisé");

    const res = await fetch(`/api/orders/user/${session.user.id}`, { cache: "no-store" });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur chargement commandes");
    }

    return res.json();
}

// ---------- UTILISATEUR / CUSTOMER ----------

// Récupérer les infos de l'utilisateur connecté
export async function getCurrentUser(): Promise<{ id: string; name: string; email: string; roles?: string[] } | null> {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    if (!res.ok) return null;

    const session = await res.json();
    if (!session?.user) return null;

    return {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        roles: session.user.roles ?? [],
    };
}




// Récupérer tous les utilisateurs (admin only)
export async function getAllUsers(): Promise<{ id: string; name: string; email: string; roles?: string[] }[]> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`/api/users`, { cache: "no-store" });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur chargement utilisateurs");
    }

    return res.json();
}

export async function getOrdersByCustomer(): Promise<Order[]> {
    const user = await getCurrentUser();
    if (!user?.id) throw new Error("Non autorisé");

    const res = await fetch(`/api/orders/user/${user.id}`, { cache: "no-store" });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur chargement commandes");
    }

    return res.json();
}

// Créer un utilisateur (admin only)
export async function createUser(data: { name: string; email: string; password: string; role?: string }): Promise<{ id: string; name: string; email: string; roles?: string[] }> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur création utilisateur");
    }

    return res.json();
}

// Mettre à jour un utilisateur (admin only)
export async function updateUser(id: string, data: Partial<{ name: string; email: string; password: string; role?: string }>): Promise<{ id: string; name: string; email: string; roles?: string[] }> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur mise à jour utilisateur");
    }

    return res.json();
}

// Supprimer un utilisateur (admin only)
export async function deleteUser(id: string): Promise<void> {
    if (!(await isAdminClient())) throw new Error("Accès refusé");

    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur suppression utilisateur");
    }
}


// ---------- AUTH ----------
export async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    return { success: true };
}
