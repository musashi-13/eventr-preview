/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            pathname: '**',
          },
          {
            protocol: 'https',
            hostname: 'avatar.iran.liara.run',
            pathname: '**',
          },
        ],
    
      },
      env: {
        API_SERVER: process.env.API_SERVER,
      }
};

export default nextConfig;
