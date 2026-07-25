"use client";

import React, { useState } from "react";
import { Search, ShoppingCart, Filter, Star, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Seeds", "Fertilizers", "Pesticides", "Tools"];

  const products = [
    { id: 1, name: "Premium Wheat Seeds", category: "Seeds", price: "₹850", rating: 4.8, seller: "AgriCo Farm Supplies", image: "https://images.unsplash.com/photo-1574323347407-2cb25908ce45?q=80&w=600&auto=format&fit=crop" },
    { id: 2, name: "Organic NPK Fertilizer 50kg", category: "Fertilizers", price: "₹1,200", rating: 4.6, seller: "Green Earth Ltd", image: "https://images.unsplash.com/photo-1628108502574-dcbefe2fb928?q=80&w=600&auto=format&fit=crop" },
    { id: 3, name: "Heavy Duty Sickle", category: "Tools", price: "₹350", rating: 4.5, seller: "Ramesh Hardware", image: "https://images.unsplash.com/photo-1590483424151-54de56e4092b?q=80&w=600&auto=format&fit=crop" },
    { id: 4, name: "Neem Oil Pesticide 1L", category: "Pesticides", price: "₹450", rating: 4.9, seller: "EcoFarm Solutions", image: "https://images.unsplash.com/photo-1582216503986-eababa306a4b?q=80&w=600&auto=format&fit=crop" },
    { id: 5, name: "Hybrid Corn Seeds", category: "Seeds", price: "₹1,500", rating: 4.7, seller: "SuperSeeds India", image: "https://images.unsplash.com/photo-1581024316135-e10dbfc0c4f8?q=80&w=600&auto=format&fit=crop" },
    { id: 6, name: "Urea Fertilizer Bag", category: "Fertilizers", price: "₹950", rating: 4.4, seller: "Government Store", image: "https://images.unsplash.com/photo-1628108425237-735d10d9f4dc?q=80&w=600&auto=format&fit=crop" },
  ];

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="flex-grow bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Agri Marketplace</h1>
            <p className="text-muted-foreground mt-2">Directly buy from verified sellers at wholesale prices.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-foreground shadow-sm transition-all"
              />
            </div>
            <button className="p-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted transition-colors relative shadow-sm hover:shadow">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-card">
                2
              </span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border hover:bg-muted whitespace-nowrap text-sm font-bold shadow-sm">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <div className="w-px h-8 bg-border mx-1"></div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-xl whitespace-nowrap text-sm font-bold transition-all shadow-sm ${
                activeCategory === category 
                  ? "bg-primary text-primary-foreground shadow-md scale-105" 
                  : "bg-card border border-border text-foreground hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="glassmorphism bg-card rounded-3xl border-border overflow-hidden flex flex-col group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden bg-muted">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider text-foreground shadow-sm">
                  {product.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-extrabold text-lg text-foreground leading-tight line-clamp-2">{product.name}</h3>
                </div>
                
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-md text-xs font-bold text-yellow-700 dark:text-yellow-500">
                    <Star className="h-3 w-3 fill-current" /> {product.rating}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium truncate">• {product.seller}</span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-2xl font-black text-primary">{product.price}</span>
                  <button className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-primary-foreground transition-all group-hover:shadow-md active:scale-95">
                    Add
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
