"use client";

import Image from "next/image";
import { Product } from "@/app/types";

interface ConfirmOrderModalProps {
  isOpen: boolean;
  product: Product | null;
  quantity: number;
  onQuantityChange: (q: number) => void;
  onClose: () => void;
  onConfirm: () => void;
  isOrdering: boolean;
}

export default function ConfirmOrderModal({
  isOpen,
  product,
  quantity,
  onQuantityChange,
  onClose,
  onConfirm,
  isOrdering,
}: ConfirmOrderModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Confirmer votre commande</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Produit */}
        <div className="flex gap-4 items-start mb-4">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={100}
              className="w-24 h-24 object-cover rounded-lg border"
            />
          )}
          <div>
            <p className="font-semibold text-lg text-gray-800">{product.name}</p>
            <p className="text-emerald-700 font-medium">
              {product.price.toLocaleString()} FCFA
            </p>
          </div>
        </div>

        {/* Quantité */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center border rounded-full"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => onQuantityChange(Number(e.target.value))}
              className="w-16 border rounded-lg px-2 py-1 text-center"
            />
            <button
              onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
              className="w-8 h-8 flex items-center justify-center border rounded-full"
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Stock disponible: {product.stock}</p>
        </div>

        {/* Total */}
        <div className="border-t pt-4 mb-4 flex justify-between">
          <span>Total</span>
          <span className="font-bold text-emerald-700">
            {(product.price * quantity).toLocaleString()} FCFA
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg border">
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isOrdering}
            className="px-5 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800"
          >
            {isOrdering ? "Traitement..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}
