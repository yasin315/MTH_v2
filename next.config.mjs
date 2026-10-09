/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  // Old URLs of the previous website -> new pages (keeps Google rankings and bookmarks working)
  async redirects() {
    const r = (source, destination) => ({ source, destination, permanent: true });
    return [
      r('/index.htm', '/de'),
      r('/index.html', '/de'),
      r('/konzept.htm', '/de#process'),
      r('/maschinen.htm', '/de#machines'),
      r('/weitere%20maschinen.htm', '/de#machines'),
      r('/anreise.htm', '/de#contact'),
      r('/kontakt.htm', '/de#contact'),
      r('/impressum.htm', '/de/impressum'),
      r('/datenschutz.htm', '/de/datenschutz'),
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};
export default nextConfig;
