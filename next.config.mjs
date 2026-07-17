/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // El gate G1 se cubre con typecheck estricto en build; el lint corre aparte (npm run lint).
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
