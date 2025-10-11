// ---------- Types ----------
export interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image: string ;
  status: string;
  statusColor: string;
  isPromo?: boolean;
  is_new?:boolean;
  likes?:number;
  oldPrice?:number;
  createdAt: string;
}

export interface ProductData {
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image?: string;  // L'image peut être une URL ou un lien de fichier
  status: string;
  statusColor: string;
  createdAt: string;
  isPromo?: boolean;
  is_new?: boolean;
  likes?:number;
  oldPrice?: number | null;
}

export interface User {
  _id: string;
  email: string;
  name:string;
  password: string;
  role: string;
}



// src/app/types/order.ts

export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    userId: User; // populate possible
    items: OrderItem[];
    totalAmount: number;
    status: 'En attente' | 'En traitement' | 'Expédiée' | 'Annulée';
    createdAt: string;
    paymentMethod?: string;
    details?: {
        address?: string;
        trackingNumber?: string;
        estimatedDelivery?: string;
    };
}

// Pour les requêtes de création de commande côté frontend
export interface OrderRequest {
    userId: string;
    items: OrderItem[];
    paymentMethod?: string;
    details?: {
        address?: string;
        trackingNumber?: string;
        estimatedDelivery?: string;
    };
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    roles?: string[];
    phone?: string;
    orders?: number;
    totalSpent?: number;
    lastOrder?: string;
}
export interface CustomerManageProps {
  activeTab: string;
}