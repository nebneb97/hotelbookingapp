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
  title: "Hotel Booking App",
  description: "A hotel booking application built with Next.js",
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
