import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { appName } from "../utils/corefunctions";
import DefaultLayout from "../components/layouts/defaultLayout";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: `${appName() || "Syncron Swap"} - DeFi Trading Platform`,
  description: "Trade crypto on top of DeFi with cross-chain bridging, swapping, and liquidity pools. Mobile-optimized PWA for seamless trading.",
  keywords: ["DeFi", "crypto", "swap", "bridge", "trading", "blockchain", "ethereum", "polygon", "BSC"],
  authors: [{ name: "Syncron Labs" }],
  creator: "Syncron Labs",
  publisher: "Syncron Labs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://syncron-swap.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${appName() || "Syncron Swap"} - DeFi Trading Platform`,
    description: "Trade crypto on top of DeFi with cross-chain bridging, swapping, and liquidity pools",
    url: 'https://syncron-swap.vercel.app',
    siteName: 'Syncron Swap',
    images: [{
      url: '/logo.webp',
      width: 1200,
      height: 630,
    }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${appName() || "Syncron Swap"} - DeFi Trading Platform`,
    description: "Trade crypto on top of DeFi with cross-chain bridging, swapping, and liquidity pools",
    images: ['/logo.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Syncron Swap',
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA and Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Syncron Swap" />
        <meta name="application-name" content="Syncron Swap" />
        <meta name="theme-color" content="#ccff00" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Apple Touch Icons */}
        <link rel="icon" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://app.debridge.finance" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${poppins.className} `}>
        <DefaultLayout>{children}</DefaultLayout>
      </body>
    </html>
  );
}
