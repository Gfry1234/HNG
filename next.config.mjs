/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // patche to allow the app  run inside Android Studio
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, //  static export and mobile
  },

}

export default nextConfig