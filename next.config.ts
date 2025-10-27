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
        return [
            {
                source: '/api/:path*',
                destination: 'https://memo-backend-sigma.vercel.app/api/:path*',
            },
        ];
    },
};

export default nextConfig;
