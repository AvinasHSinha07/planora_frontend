/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '**' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '**' },
            { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '**' },
            { protocol: 'https', hostname: 'images.unsplash.com', pathname: '**' },
            { protocol: 'https', hostname: 'plus.unsplash.com', pathname: '**' },
            { protocol: 'https', hostname: 'i.pravatar.cc', pathname: '**' },
            { protocol: 'https', hostname: 'images.pexels.com', pathname: '**' }
        ],
    },
    async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        const backEndBase = apiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

        return [
            {
                source: "/api/v1/:path*",
                destination: `${backEndBase}/api/v1/:path*`,
            },
        ];
    },
};

export default nextConfig;
