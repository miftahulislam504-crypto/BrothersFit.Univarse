/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(glb|gltf|hdr|exr)$/,
      type: "asset/resource",
    });

    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        "three",
        "@react-three/fiber",
        "@react-three/drei",
        "@react-three/postprocessing",
      ];
    }

    return config;
  },

  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
  ],
};

module.exports = nextConfig;
