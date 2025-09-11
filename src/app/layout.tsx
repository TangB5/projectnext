import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./lib/authProvider";
import { Toaster } from 'react-hot-toast';
import { Navbar } from "./ui/nav/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <Navbar/>
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
       </AuthProvider>
        
      </body>
    </html>
  );
}
