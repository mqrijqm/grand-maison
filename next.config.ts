import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: localhost, 127.0.0.1 and phones on the same Wi-Fi (private LAN IPs, e.g. 10.251.251.18).
  // Without these, Next blocks dev assets for the phone, so the page loads with no JavaScript.
  allowedDevOrigins: ['127.0.0.1', 'localhost', '10.*.*.*', '192.168.*.*', '172.*.*.*'],
  // "Objave" su preimenovane u "Vodiči" — stari linkovi i dalje rade.
  async redirects() {
    return [
      { source: '/objave', destination: '/vodici', permanent: true },
      { source: '/objave/:slug', destination: '/vodici/:slug', permanent: true },
    ]
  },
};

export default nextConfig;
