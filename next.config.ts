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
                port: '5000',
                pathname: '/**',
            },
        ],
    },

    async rewrites() {
        if (process.env.NODE_ENV === 'development') {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';


            console.log(`[Next.js Proxy] Actif : Redirection de /api/* vers ${backendUrl}/api/*`);

            return [
                {
                    source: '/api/:path*',
                    destination: `${backendUrl}/api/:path*`,
                },
            ];
        }

        return [];
    },
};

export default nextConfig;