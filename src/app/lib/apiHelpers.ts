'use server'
import { z } from "zod";
import { deleteSession, getSession } from "../lib/session";
import { Product, Commande, ProductData, OrderItem } from "../types";
import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL 

// ---------- Produits ----------
export const createProduct = async (productData: ProductData): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/createProduct`, {
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
  const response = await fetch(`${API_BASE_URL}/api/products`);
  if (!response.ok) throw new Error('Erreur lors du chargement des produits');
  return await response.json();
};

export const deleteProduit = async (id: string): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/api/product/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Échec de la suppression');
  revalidatePath('/dashboard/products');
  return await response.json();
};

export const updateProduit = async (
  id: string,
  productData: Omit<Product, "_id" | "createdAt">
): Promise<Product> => {
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



//login

export async function login(data: { email: string; password: string }) {
  const { email, password } = data;

  // validation
  const loginSchema = z.object({
    email: z.string().email().trim(),
    password: z.string().min(8).trim(),
  });

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      const { message } = await res.json();
      return { errors: { email: [message || "Email ou mot de passe incorrect."] } };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { errors: { email: ["Erreur serveur."] } };
  }
}


export async function logout() {
  await deleteSession();
  return { success: true };
}

// Register avec objet simple

export async function register(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const { name, email, password, confirmPassword } = data;

  // Validation côté frontend
  const errors: Record<string, string[]> = {};
  if (!name) errors.name = ['Le nom est requis'];
  if (!email) errors.email = ['L\'email est requis'];
  if (!password) errors.password = ['Le mot de passe est requis'];
  if (password !== confirmPassword) errors.confirmPassword = ['Les mots de passe ne correspondent pas'];

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Si le backend renvoie des erreurs spécifiques, on les renvoie
      const backendErrors: Record<string, string[]> = {};
      if (responseData.message?.includes('email')) {
        backendErrors.email = ['Cet email est déjà utilisé'];
      } else if (responseData.errors) {
        Object.assign(backendErrors, responseData.errors);
      } else {
        backendErrors.general = [responseData.message || 'Erreur serveur'];
      }
      return { success: false, errors: backendErrors };
    }

    return { success: true, message: 'Inscription réussie !', errors: null };
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return { success: false, errors: { general: ['Une erreur est survenue'] } };
  }
}


// ---------- Commandes ----------
export async function createCommande(userId: string, items: OrderItem[]) {
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
  if (!session?.userId) throw new Error("Non autorisé");

  const response = await fetch(`${API_BASE_URL}/api/commandes/user/${session.userId}`, { cache: 'no-store' });
  if (!response.ok) throw new Error("Erreur lors du chargement des commandes");
  return await response.json();
}

export async function getAllCommandes(): Promise<Commande[]> {
  const session = await getSession();
  if (session?.role !== "admin") throw new Error("Accès refusé");

  const response = await fetch(`${API_BASE_URL}/api/commandes`, { cache: 'no-store' });
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
  revalidatePath('/dashboard/commandes');
  return await response.json();
}

export async function deleteCommande(id: string) {
  const session = await getSession();
  if (session?.role !== "admin") throw new Error("Accès refusé");

  const response = await fetch(`${API_BASE_URL}/api/commande/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error("Erreur lors de la suppression");
  revalidatePath('/dashboard/commandes');
  return await response.json();
}
