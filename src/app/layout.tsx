// app/layout.tsx (CECI EST UN SERVER COMPONENT PAR DÉFAUT)
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./lib/authProvider";
import ClientLayout from "./ClientLayout";





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
            className={`  antialiased`}
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