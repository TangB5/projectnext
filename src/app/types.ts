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
  password: string;
  role: string;
}

export interface Commande {
  _id: string;
  userId: string;
  products: { productId: string; quantity: number }[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}


export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}
export interface Customer {
    id: string; // Utilisez string pour correspondre aux identifiants du backend
    name: string;
    email: string;
    phone: string;
    orders: number;
    totalSpent: number;
    lastOrder: string;
}

export interface CustomerManageProps {
    activeTab: string;
}