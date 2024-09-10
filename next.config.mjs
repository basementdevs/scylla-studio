/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@lambda-group/scylladb"
    ]
  }
};

export default nextConfig;
