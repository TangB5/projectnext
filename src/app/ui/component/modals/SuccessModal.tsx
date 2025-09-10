"use client";

import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, message, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
        <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Succès !</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
