/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io', // UploadThing သုံးထားရင် ဒါကိုပါ ထည့်ပေးဖို့ လိုပါလိမ့်မယ်
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Build လုပ်တဲ့အချိန် ESLint Error ရှိနေရင်တောင် ဆက်လုပ်ပေးအောင်လုပ်ခြင်း
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;