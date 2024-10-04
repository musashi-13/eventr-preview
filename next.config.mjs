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
        API_LOCAL: process.env.API_LOCAL,
      }
};

export default nextConfig;
