import React from 'react';
import Link from 'next/link';
import { Leaf, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12 py-10 text-card-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-primary">Gram<span className="text-secondary-foreground dark:text-secondary">AI</span></span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Smart Village Hub empowering farmers with AI, market access, and government scheme assistance.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/ai-scan" className="hover:text-primary transition-colors">AI Crop Scan</Link></li>
              <li><Link href="/govt-buddy" className="hover:text-primary transition-colors">Govt Scheme Buddy</Link></li>
              <li><Link href="/marketplace" className="hover:text-primary transition-colors">Agriculture Marketplace</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Book Machinery</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" /> 
                <span>Pune, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" /> 
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" /> 
                <span>support@gramai.in</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GramAI. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <span className="mx-2 hover:text-primary cursor-pointer transition-colors">English</span> |
            <span className="mx-2 hover:text-primary cursor-pointer transition-colors">मराठी</span> |
            <span className="mx-2 hover:text-primary cursor-pointer transition-colors">हिंदी</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
