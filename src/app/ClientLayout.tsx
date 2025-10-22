// app/ClientLayout.tsx (CECI EST UN CLIENT COMPONENT)
"use client";

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Navbar } from "./ui/nav/navbar"; // Assurez-vous que le chemin est correct
import { usePathname } from 'next/navigation';

const NO_NAV_PATHS = [
    '/auth/login',
    '/auth/signup',
    '/dashboard',
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const shouldRenderNav = !NO_NAV_PATHS.some(path => pathname.startsWith(path));

    return (
        <>
            {shouldRenderNav && <Navbar />}
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    success: {
                        style: {
                            background: '#4ade80', // vert
                            color: 'white',
                        },
                    },
                    error: {
                        style: {
                            background: '#f87171', // rouge
                            color: 'white',
                        },
                    },
                }}
            />
        </>
    );
}