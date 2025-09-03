'use client';

import { motion } from 'framer-motion';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    label: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, label }: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
                Page {currentPage} sur {totalPages} ({label})
            </p>
            <div className="flex items-center gap-1">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    <i className="pi pi-chevron-left"></i>
                </motion.button>
                {pages.map(page => (
                    <motion.button
                        key={page}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                            currentPage === page ? 'bg-purple-600 text-white border-purple-600' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {page}
                    </motion.button>
                ))}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    <i className="pi pi-chevron-right"></i>
                </motion.button>
            </div>
        </div>
    );
}