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
        API_SERVER: 'https://ab82-2401-4900-4df7-2b22-4162-a4ef-8bf8-df3f.ngrok-free.app',
      }
};

export default nextConfig;
