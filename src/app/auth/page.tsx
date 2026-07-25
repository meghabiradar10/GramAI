"use client";

import React, { useState } from "react";
import { Leaf, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "role">("phone");
  const [role, setRole] = useState<"farmer" | "provider" | null>(null);
  const router = useRouter();
  const { setUserRole } = useAuth(); // Mocking auth updates

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      // Mock OTP send
      setStep("otp");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      // Mock verify
      setStep("role");
    }
  };

  const handeCompleteProfile = () => {
    if (role === "farmer") {
      setUserRole("farmer");
      router.push("/dashboard/farmer");
    } else if (role === "provider") {
      setUserRole("provider");
      router.push("/dashboard/provider");
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-md w-full space-y-8 glassmorphism p-8 md:p-10 rounded-3xl relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-secondary/20 blur-2xl"></div>
        
        <div className="text-center relative z-10">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-foreground">
            Welcome to GramAI
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Smart Village Hub for Farmers
          </p>
        </div>

        <div className="mt-8 relative z-10">
          {step === "phone" && (
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6" 
              onSubmit={handleSendOtp}
            >
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-muted-foreground sm:text-sm border-r border-border pr-2">+91</span>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    className="block w-full pl-16 pr-3 py-3 sm:text-sm bg-card border border-border rounded-xl focus:ring-primary focus:border-primary text-foreground transition-all"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={phoneNumber.length < 10}
                className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Send OTP
              </button>
            </motion.form>
          )}

          {step === "otp" && (
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6" 
              onSubmit={handleVerifyOtp}
            >
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-foreground text-center">
                  Enter 6-digit OTP sent to +91 {phoneNumber}
                </label>
                <div className="mt-4 flex justify-center">
                  <input
                    type="text"
                    id="otp"
                    className="block w-48 text-center text-3xl tracking-[0.3em] py-3 bg-card border border-border rounded-xl focus:ring-primary focus:border-primary text-foreground transition-all font-mono"
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={otp.length !== 6}
                className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="w-full text-center text-sm text-primary hover:underline"
              >
                Change Phone Number
              </button>
            </motion.form>
          )}

          {step === "role" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-4">How do you want to use GramAI?</p>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setRole("farmer")}
                    className={`cursor-pointer rounded-2xl border-2 p-6 text-center transition-all ${role === 'farmer' ? 'border-primary bg-primary/10 shadow-md' : 'border-border bg-card hover:border-primary/50'}`}
                  >
                    <Leaf className={`h-10 w-10 mx-auto mb-3 ${role === 'farmer' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`block font-semibold ${role === 'farmer' ? 'text-primary' : 'text-foreground'}`}>Farmer</span>
                  </div>
                  <div 
                    onClick={() => setRole("provider")}
                    className={`cursor-pointer rounded-2xl border-2 p-6 text-center transition-all ${role === 'provider' ? 'border-primary bg-primary/10 shadow-md' : 'border-border bg-card hover:border-primary/50'}`}
                  >
                    <Phone className={`h-10 w-10 mx-auto mb-3 ${role === 'provider' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`block font-semibold ${role === 'provider' ? 'text-primary' : 'text-foreground'}`}>Service Provider</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handeCompleteProfile}
                disabled={!role}
                className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
              >
                Continue to Dashboard
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
