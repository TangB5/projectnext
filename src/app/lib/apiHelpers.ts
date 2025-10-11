'use server'

import { deleteSession, getSession } from "./session";
import { Product, Commande, ProductData, OrderItem } from "../types";
import { revalidatePath } from "next/cache";


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// NOTE: Le code pour 'registerAction' et 'register' a été retiré de ce fichier
// et déplacé dans des fichiers appropriés pour le client-side.

const isAdmin = async () => {
    const session = await getSession();
    return session?.user?.roles?.includes("admin") ?? false;
};


// ---------- Produits ----------
export const createProduct = async (productData: ProductData): Promise<Product> => {
    if (!await isAdmin()) throw new Error("Accès refusé. Rôle administrateur requis.");


    const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du produit');
    }
    revalidatePath('/dashboard/products');
    return await response.json();
};

export const getProducts = async (): Promise<Product[]> => {
    // Cette fonction n'a pas besoin de vérification de session si elle est publique.
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) throw new Error('Erreur lors du chargement des produits');
    return await response.json();
};

export const deleteProduit = async (id: string): Promise<unknown> => {
    if (!await isAdmin()) throw new Error("Accès refusé. Rôle administrateur requis.");

    const response = await fetch(`${API_BASE_URL}/api/product/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Échec de la suppression');
    revalidatePath('/dashboard/products');
    return await response.json();
};

export const updateProduit = async (
    id: string,
    productData: Omit<Product, "_id" | "createdAt">
): Promise<Product> => {
    if (!await isAdmin()) throw new Error("Accès refusé. Rôle administrateur requis.");

    const response = await fetch(`${API_BASE_URL}/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour du produit");
    }
    revalidatePath('/dashboard/products');
    return await response.json();
};

// ---------- Auth (uniquement logout) ----------

export async function logout() {
    await deleteSession();
    return { success: true };
}


// ---------- Commandes ----------
export async function createCommande(userId: string, items: OrderItem[]) {
    // Ceci devrait probablement devenir un Server Action ou être géré dans une API route.
    // Laisse la logique fetch ici pour l'instant.
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, items }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la commande');
    }
    return await response.json();
}

export async function getMyCommandes(): Promise<Commande[]> {
    const session = await getSession();
    if (!session?.user?.id) throw new Error("Non autorisé");

    const response = await fetch(`${API_BASE_URL}/api/commandes/user/${session.user.id}`, { cache: 'no-store' });
    if (!response.ok) throw new Error("Erreur lors du chargement des commandes");
    return await response.json();
}

export async function getAllCommandes(): Promise<Commande[]> {
    if (!await isAdmin()) throw new Error("Accès refusé");

    const response = await fetch(`${API_BASE_URL}/api/commandes`, { cache: 'no-store' });
    if (!response.ok) throw new Error("Erreur lors du chargement des commandes");
    return await response.json();
}

export async function updateCommandeStatus(id: string, status: Commande["status"]) {
    if (!await isAdmin()) throw new Error("Accès refusé");

    const response = await fetch(`${API_BASE_URL}/api/commande/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour");
    revalidatePath('/dashboard/commandes');
    return await response.json();
}

export async function deleteCommande(id: string) {
    if (!await isAdmin()) throw new Error("Accès refusé");

    const response = await fetch(`${API_BASE_URL}/api/commande/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error("Erreur lors de la suppression");
    revalidatePath('/dashboard/commandes');
    return await response.json();
}
