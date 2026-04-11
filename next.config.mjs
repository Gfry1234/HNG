/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // CRITICAL: This allows the app to run inside Android Studio
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Necessary for both static export and mobile
  },
  // If 'allowedDevOrigins' is failing in experimental, 
  // we remove it to let the server start without errors.
}

export default nextConfig