'use server'
import { z } from "zod";
import { deleteSession, getSession } from "../lib/session";
import { redirect } from "next/navigation";
import { Product, Commande, ProductData, OrderItem } from "../types";
import { revalidatePath } from "next/cache"; // Importe revalidatePath


const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3000/api';


// ---------- Produits ----------
export const createProduct = async (productData: ProductData): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/createProduct`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erreur lors de la création du produit');
  }

  revalidatePath('/dashboard/products'); // Revalider la liste des produits après la création
  return await response.json();
};

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  if (!response.ok) throw new Error('Erreur lors du chargement des produits');
  return await response.json();
};

export const deleteProduit = async (id: string): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/api/product/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Échec de la suppression');
  revalidatePath('/dashboard/products'); // Revalider après la suppression
  return await response.json();
};

export const updateProduit = async (
  id: string,
  productData: Omit<Product, "_id" | "createdAt">
): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/api/product/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de la mise à jour du produit");
  }

  revalidatePath('/dashboard/products'); // Revalider après la mise à jour
  return await response.json();
};


// ---------- Authentification ----------
const loginSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }).trim(),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }).trim(),
});

export async function login(prevState: unknown, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { errors: result.error.flatten().fieldErrors };

  const { email, password } = result.data;

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });

    if (!res.ok) {
      const { message } = await res.json();
      return { errors: { email: [message || "Email ou mot de passe incorrect."] } };
    }

    revalidatePath('/dashboard'); // Revalider le dashboard pour afficher le nouveau statut de session
    redirect('/dashboard'); // Redirige après une connexion réussie
    return { success: true };

  } catch (error) {
    console.error("Erreur de connexion :", error);
    return { errors: { email: ["Erreur serveur."] } };
  }
}


// app/api/route.ts
export async function logout() {
  await deleteSession(); // supprime la session côté serveur
  return { success: true };
}


export async function register(prevState: unknown, formData: FormData) {
  try {
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    if (password !== confirmPassword) {
      return { errors: { confirmPassword: 'Les mots de passe ne correspondent pas' }, success: false };
    }

    const userData = { name: formData.get('name'), email: formData.get('email'), password };
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (!response.ok) {
      return { errors: data.errors || { general: data.message }, success: false };
    }

    // Pas de revalidation ou redirection ici, car l'utilisateur doit se connecter après l'inscription
    return { success: true, message: 'Inscription réussie !', errors: null };
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return { errors: { general: 'Une erreur est survenue' }, success: false };
  }
}

// ---------- Commandes ----------
// src/app/api/route.js (ou l'emplacement de votre helper)


export async function createCommande(userId : string, items:OrderItem[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // C'EST L'ÉTAPE CLÉ : envoyer un objet avec les bonnes clés
      body: JSON.stringify({
        userId: userId,
        items: items,
      }),
    });

    if (!response.ok) {
      // Si la réponse n'est pas OK, lance une erreur avec le message du serveur
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création de la commande');
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Erreur dans createCommande :", error);
    throw error;
  }
}

export async function getMyCommandes(): Promise<Commande[]> {
  const session = await getSession();
  if (!session?.userId) throw new Error("Non autorisé");

  const response = await fetch(`${API_BASE_URL}/api/commandes/user/${session.userId}`, {
    cache: 'no-store' // S'assure que les données ne sont pas en cache
  });
  if (!response.ok) throw new Error("Erreur lors du chargement des commandes");
  return await response.json();
}

export async function getAllCommandes(): Promise<Commande[]> {
  const session = await getSession();
  if (session?.role !== "admin") throw new Error("Accès refusé");

  const response = await fetch(`${API_BASE_URL}/api/commandes`, {
    cache: 'no-store'
  });
  if (!response.ok) throw new Error("Erreur lors du chargement des commandes");
  return await response.json();
}

export async function updateCommandeStatus(id: string, status: Commande["status"]) {
  const session = await getSession();
  if (session?.role !== "admin") throw new Error("Accès refusé");

  const response = await fetch(`${API_BASE_URL}/api/commande/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error("Erreur lors de la mise à jour");
  revalidatePath('/dashboard/commandes'); // Revalide le tableau de bord des commandes
  return await response.json();
}

export async function deleteCommande(id: string) {
  const session = await getSession();
  if (session?.role !== "admin") throw new Error("Accès refusé");

  const response = await fetch(`${API_BASE_URL}/api/commande/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error("Erreur lors de la suppression");
  revalidatePath('/dashboard/commandes'); // Revalide après la suppression
  return await response.json();
}