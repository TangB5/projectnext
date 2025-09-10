"use client";

import Image from "next/image";
import { Product } from "@/app/types";

interface LoginModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

export default function LoginModal({ isOpen, product, onClose }: LoginModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Veuillez vous connecter</h2>
        <p className="mb-2">
          Vous devez être connecté pour commander :
          <span className="font-semibold"> {product.name}</span>
        </p>
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            className="w-full h-40 object-cover rounded mb-4"
          />
        )}
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Annuler
          </button>
          <a
            href="/auth/login"
            className="bg-emerald-700 text-white px-4 py-2 rounded hover:bg-emerald-800"
          >
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
}
