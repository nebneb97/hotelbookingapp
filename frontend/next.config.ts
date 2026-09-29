import type { NextConfig } from "next";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  images: {
    ...(isDev && { dangerouslyAllowLocalIP: true }),
    remotePatterns: [
      ...(isDev ? [{ hostname: "127.0.0.1" }] : []),
      { hostname: "hotelbookingapp-4rw8.onrender.com" },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/pool", destination: "/hotels", permanent: true },
      { source: "/restaurant", destination: "/hotels", permanent: true },
    ];
  },
};

export default nextConfig;
