// app/ui/component/modals/LogoutConfirmModal.tsx
"use client";
import { motion } from "framer-motion";

interface LogoutConfirmModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export function LogoutConfirmModal({ onConfirm, onCancel }: LogoutConfirmModalProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm"
            >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmation de déconnexion</h3>
                <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir vous déconnecter de votre compte ?</p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                    >
                        Déconnexion
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}