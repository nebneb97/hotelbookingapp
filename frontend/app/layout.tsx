import type { Metadata } from "next";
import { Marcellus, Urbanist } from "next/font/google";
import "./globals.css";

//components
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const marcellus = Marcellus({
  weight: ["400"],
  variable: "--font-marcellus",
  subsets: ["latin"],
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thebooker-hotel.vercel.app"),
  title: {
    default: "TheBooker — Hotel Booking in Kuala Lumpur",
    template: "%s | TheBooker",
  },
  description: "Book handpicked hotels across Kuala Lumpur. Transparent pricing, instant confirmation, zero hidden fees.",
  keywords: ["hotel booking", "Kuala Lumpur hotels", "KL accommodation", "book hotel Malaysia", "TheBooker"],
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: "https://thebooker-hotel.vercel.app",
    siteName: "TheBooker",
    title: "TheBooker — Hotel Booking in Kuala Lumpur",
    description: "Book handpicked hotels across Kuala Lumpur. Transparent pricing, instant confirmation, zero hidden fees.",
    images: [
      {
        url: "/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "TheBooker — Hotel Booking in Kuala Lumpur",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "TheBooker — Hotel Booking in Kuala Lumpur",
    description: "Book handpicked hotels across Kuala Lumpur. Transparent pricing, instant confirmation, zero hidden fees.",
    images: ["/web-app-manifest-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${marcellus.variable} ${urbanist.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
