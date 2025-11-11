/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ tells Vercel to use the modern app router runtime
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
