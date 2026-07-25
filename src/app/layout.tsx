import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "GramAI - Smart Village Hub",
  description: "AI-powered web application for farmers providing AI Crop Disease Detection, Govt Scheme Assistant, Agriculture Marketplace, and Booking System.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
