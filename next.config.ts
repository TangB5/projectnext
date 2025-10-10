import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'jjoaiktmljbilrjxeqxk.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },

            {
                protocol: 'https',
                hostname: 'memo-backend-sigma.vercel.app',
                pathname: '/**',
            },

            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5000', // Assurez-vous que c'est le bon port du backend
                pathname: '/**',
            },
        ],
    },

    async rewrites() {
        // 🚨 CORRECTION CRUCIALE : Appliquer le proxy uniquement en environnement local
        if (process.env.NODE_ENV === 'development') {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

            // Assurez-vous que backendUrl est bien l'URL locale pour le proxy
            // Nous utilisons ici directement la variable pour la flexibilité si elle est définie localement

            console.log(`[Next.js Proxy] Actif : Redirection de /api/* vers ${backendUrl}/api/*`);

            return [
                {
                    source: '/api/:path*',
                    destination: `${backendUrl}/api/:path*`, // Utilise l'URL locale (e.g., http://localhost:5000)
                },
            ];
        }

        // En production ou autres environnements, aucune réécriture n'est nécessaire
        return [];
    },
};

export default nextConfig;