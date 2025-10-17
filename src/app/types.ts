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
    _id?: string;
    name: string;
    email: string;
    password?: string; // optionnel
    roles?: string[];


    phone?: string;
    avatar?: string;
    address?: {
        street?: string;
        city?: string;
        postalCode?: string;
        country?: string;
    };
    preferences?: {
        newsletter?: boolean;
        smsNotifications?: boolean;
        emailNotifications?: boolean;
    };
    createdAt?: string;
    orderCount?: number;
    loyaltyTier?: string;
}





// src/app/types/order.ts

export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
}

export interface OrderDetails {
    address?: string;
    phone?: string; // ✅ ajouté
    trackingNumber?: string;
    estimatedDelivery?: string;
}

export interface Order {
    _id: string;
    userId: User; // populate possible
    items: OrderItem[];
    totalAmount: number;
    status: "En attente" | "En traitement" | "Expédiée" | "Annulée";
    createdAt: string;
    paymentMethod?: string;
    details?: OrderDetails;
}


export interface OrderRequest {
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    paymentMethod?: string;
    details?: OrderDetails;
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