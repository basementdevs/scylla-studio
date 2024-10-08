/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: [
      "@lambda-group/scylladb"
    ]
  }
};

export default nextConfig;
