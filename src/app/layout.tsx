// app/layout.tsx (CECI EST UN SERVER COMPONENT PAR DÉFAUT)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./lib/authProvider";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// ✅ Le metadata est CORRECTEMENT ici.
export const metadata: Metadata = {
    title: "MEMO",
    description: "application de vente de meuble pre fabriquer",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <AuthProvider>
            <ClientLayout>
                {children}
            </ClientLayout>
        </AuthProvider>
        </body>
        </html>
    );
}