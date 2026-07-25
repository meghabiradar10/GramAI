"use client";

import React, { useState } from "react";
import { MapPin, Calendar, Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("Machinery");

  const services = [
    { id: 1, type: "Tractor (with Cultivator)", provider: "Raju Patil", location: "Baramati, Pune", distance: "4.2 km", rating: 4.9, reviews: 124, price: "₹600/hr", image: "https://images.unsplash.com/photo-1592982537447-6f296d9cc92f?q=80&w=600&auto=format&fit=crop", verified: true },
    { id: 2, type: "Combine Harvester", provider: "Kisan Sewa Kendra", location: "Shirur, Pune", distance: "12 km", rating: 4.7, reviews: 89, price: "₹2000/hr", image: "https://images.unsplash.com/photo-1605333519159-4d642cb83a45?q=80&w=600&auto=format&fit=crop", verified: true },
    { id: 3, type: "Drone Spraying Service", provider: "AgriTech Solutions", location: "Pune District", distance: "Serves your area", rating: 4.8, reviews: 56, price: "₹800/acre", image: "https://images.unsplash.com/photo-1579836338423-74b8686d63ae?q=80&w=600&auto=format&fit=crop", verified: true },
    { id: 4, type: "Submersible Pump Repair", provider: "Ganesh Electronics", location: "Indapur", distance: "8.5 km", rating: 4.5, reviews: 42, price: "₹300 visit", image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=600&auto=format&fit=crop", verified: false },
  ];

  return (
    <div className="flex-grow bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-emerald-700 rounded-3xl p-8 md:p-12 text-white mb-10 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white leading-tight">Hire Farm Machinery & Experts</h1>
            <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed font-medium">
              Find reliable tractors, harvesters, drone services, and repair technicians near your village.
            </p>
            
            <div className="glassmorphism bg-white/10 dark:bg-black/20 border-white/20 p-3 rounded-2xl flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
                <input 
                  type="text" 
                  placeholder="Enter your village or district" 
                  className="w-full pl-12 pr-4 py-4 bg-white/10 text-white placeholder-white/80 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 border border-transparent transition-all"
                  defaultValue="Pune, Maharashtra"
                />
              </div>
              <button className="bg-white text-primary font-bold py-4 px-10 rounded-xl hover:bg-white/90 transition-all shadow-lg active:scale-95 text-lg">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-border/50 mb-10 overflow-x-auto scrollbar-hide">
          {["Machinery", "Laborers", "Technicians", "Agri-Experts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 text-sm md:text-base font-bold whitespace-nowrap transition-colors relative ${
                activeTab === tab 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary rounded-t-full" 
                />
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-6">
          {services.map((service) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glassmorphism bg-card border-border rounded-3xl p-4 sm:p-6 flex flex-col md:flex-row gap-6 lg:gap-8 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="md:w-72 h-56 md:h-auto shrink-0 rounded-2xl overflow-hidden relative shadow-sm">
                <img src={service.image} alt={service.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                {service.verified && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                    <ShieldCheck className="h-4 w-4" /> Verified
                  </div>
                )}
              </div>
              
              <div className="flex-grow flex flex-col justify-between py-2">
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-2">
                    <h2 className="text-2xl font-extrabold text-foreground">{service.type}</h2>
                    <div className="text-left md:text-right shrink-0">
                      <div className="text-2xl font-black text-primary">{service.price}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-foreground font-semibold text-lg">{service.provider}</span>
                    <span className="text-border mx-1">|</span>
                    <span className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-md text-sm font-bold text-yellow-700 dark:text-yellow-500">
                      <Star className="h-4 w-4 fill-current" /> {service.rating} ({service.reviews})
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6 font-medium">
                    <span className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> {service.location} <span className="text-primary/70 shrink-0">({service.distance})</span></span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-auto pt-5 border-t border-border">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary/10 text-primary font-bold py-3 px-8 rounded-xl hover:bg-primary/20 transition-all">
                    <Calendar className="h-5 w-5" /> View Schedule
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95">
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
