"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, FileScan, MessageSquareText, ShoppingBag, Tractor } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  const features = [
    {
      title: "AI Crop Doctor",
      description: "Scan images of your crops to instantly identify diseases and get treatment recommendations.",
      icon: <FileScan className="h-8 w-8 text-primary" />,
      link: "/ai-scan",
      color: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Govt Scheme Buddy",
      description: "Ask our AI assistant about eligibility and application processes for government schemes.",
      icon: <MessageSquareText className="h-8 w-8 text-primary" />,
      link: "/govt-buddy",
      color: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Agri Marketplace",
      description: "Buy and sell seeds, fertilizers, and products at the best prices directly with verified users.",
      icon: <ShoppingBag className="h-8 w-8 text-primary" />,
      link: "/marketplace",
      color: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "Machinery Booking",
      description: "Find and book nearby tractors, harvesters, and technicians on an hourly or daily basis.",
      icon: <Tractor className="h-8 w-8 text-primary" />,
      link: "/services",
      color: "bg-yellow-50 dark:bg-yellow-900/20",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 dark:opacity-5 mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium"
            >
              <Leaf className="h-4 w-4" />
              Empowering farmers across Maharashtra
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6"
            >
              Smart Farming, <br className="hidden md:block" />
              <span className="text-primary">Smarter Villages</span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed"
            >
              GramAI brings advanced AI technology to your fingertips. Identify crop diseases, navigate govt schemes, and access an agriculture marketplace in your local language.
            </motion.p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                href="/auth"
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Get Started
              </Link>
              <Link 
                href="#services"
                className="px-8 py-3 rounded-xl bg-white dark:bg-card text-foreground font-semibold text-lg border border-border hover:bg-muted transition-all shadow-sm hover:shadow-md"
              >
                Explore Services
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to increase yield, reduce costs, and simplify farming operations.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link href={feature.link} className="block h-full">
                  <div className="h-full bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                    <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-20 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Why Choose GramAI?</h2>
              <ul className="space-y-4">
                {[
                  "Available in Marathi, Hindi, and English",
                  "Optimized for low internet connectivity",
                  "Direct connection with verified local service providers",
                  "AI trained specifically on Indian crop varieties",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595822941198-469b64ea3238?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
