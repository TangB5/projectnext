"use client";

import { XCircle } from "lucide-react";

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function ErrorModal({ isOpen, message, onClose }: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
        <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Erreur</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
