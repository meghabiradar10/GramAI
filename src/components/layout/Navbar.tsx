"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Globe, Leaf } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState("English");

  const toggleLanguage = () => {
    const langs = ["English", "मराठी", "हिंदी"];
    const currentIndex = langs.indexOf(language);
    setLanguage(langs[(currentIndex + 1) % langs.length]);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "AI Scan", href: "/ai-scan" },
    { name: "Govt Buddy", href: "/govt-buddy" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Services", href: "/services" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glassmorphism text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <Link href="/" className="text-2xl font-bold text-primary">
              Gram<span className="text-secondary-foreground dark:text-secondary">AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4" />
              {language}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/farmer" className="hover:text-primary font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors dark:bg-red-900/30 dark:text-red-400"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow"
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-muted focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-muted hover:text-primary"
            >
              <Globe className="h-5 w-5" />
              Language: {language}
            </button>

            {user ? (
              <>
                <Link
                  href="/dashboard/farmer"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary-foreground bg-primary mt-4"
                onClick={() => setIsOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
