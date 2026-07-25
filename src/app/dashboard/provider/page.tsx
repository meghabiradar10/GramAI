"use client";

import React from "react";
import { Star, TrendingUp, Users, Calendar, Settings, Plus, CheckCircle, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ProviderDashboard() {
  const requests = [
    { id: "REQ-01", farmer: "Suresh Kadge", service: "Tractor (Cultivator)", date: "Tomorrow, 08:00 AM", location: "Baramati, 4.2 km away", status: "Pending" },
    { id: "REQ-02", farmer: "Anil Shinde", service: "Tractor (Transport)", date: "Oct 18, 10:00 AM", location: "Indapur, 12 km away", status: "Confirmed" },
  ];

  return (
    <div className="flex-grow bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Provider Dashboard</h1>
            <p className="text-muted-foreground mt-2 font-medium">Manage your service listings, bookings, and subscriptions.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <span className="px-4 py-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-extrabold tracking-wide text-sm flex items-center gap-2 border border-orange-200 dark:border-orange-800 shadow-sm">
              <Star className="h-4 w-4 fill-current" /> PRO PLAN
            </span>
            <button className="bg-card text-foreground p-3 rounded-xl font-bold border border-border hover:bg-muted transition-all shadow-sm group">
              <Settings className="h-5 w-5 group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Total Earnings", amount: "₹42,500", icon: <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />, sub: "This Month" },
            { title: "Completed Jobs", amount: "34", icon: <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />, sub: "Top 10% in area" },
            { title: "Total Clients", amount: "128", icon: <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />, sub: "+12 new this month" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glassmorphism bg-card border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div>
                <h3 className="text-muted-foreground font-bold tracking-wide uppercase text-sm mb-2">{stat.title}</h3>
                <h2 className="text-4xl font-black text-foreground mb-1">{stat.amount}</h2>
                <p className="text-sm text-primary font-semibold">{stat.sub}</p>
              </div>
              <div className="p-4 bg-muted/40 border border-border/50 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">{stat.icon}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Listings */}
          <div className="glassmorphism bg-card border-border rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
              <h2 className="text-2xl font-bold text-foreground">Your Active Listings</h2>
              <button className="flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 border border-border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-md transition-all gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 shadow-sm border border-border/50">
                    <img src="https://images.unsplash.com/photo-1592982537447-6f296d9cc92f?q=80&w=200&auto=format&fit=crop" alt="Tractor" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground text-lg mb-1 leading-tight">Mahindra Tractor 45HP</h3>
                    <p className="text-sm text-muted-foreground font-medium mb-1.5">Cultivation & Transport</p>
                    <div className="text-primary font-black text-lg">₹600/hr</div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 text-sm font-medium mt-2 sm:mt-0">
                  <span className="text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 font-bold px-3 py-1 rounded-md flex items-center gap-1.5 uppercase tracking-wide text-xs"><CheckCircle className="h-3.5 w-3.5"/> Active</span>
                  <button className="text-primary/70 hover:text-primary transition-colors font-bold underline">Edit Listing</button>
                </div>
              </div>
            </div>
          </div>

          {/* New Booking Requests */}
          <div className="glassmorphism bg-card border-border rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-8 border-b border-border pb-4">Booking Requests</h2>
            
            <div className="space-y-5">
              {requests.map((req) => (
                <div key={req.id} className="p-5 border border-border rounded-2xl bg-gradient-to-br from-card to-muted/20 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-lg border border-primary/20">{req.farmer.charAt(0)}</div>
                      <div>
                        <span className="font-extrabold text-foreground text-lg block leading-tight">{req.farmer}</span>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{req.id}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-md ${req.status === 'Pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {req.status}
                    </span>
                  </div>
                  
                  <div className="bg-card p-4 rounded-xl border border-border/50 mb-5">
                    <h3 className="font-bold text-lg mb-3 text-foreground">{req.service}</h3>
                    <div className="flex flex-col gap-2 text-sm text-foreground font-medium">
                      <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {req.date}</span>
                      <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {req.location}</span>
                    </div>
                  </div>
                  
                  {req.status === 'Pending' ? (
                    <div className="flex gap-3">
                      <button className="flex-[2] bg-primary text-primary-foreground py-3 rounded-xl font-extrabold hover:bg-primary/90 transition-all shadow-md active:scale-95 text-base">Accept Job</button>
                      <button className="flex-[1] bg-card text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 border border-red-200 transition-all">Decline</button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-sm font-bold bg-green-50/50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/30">
                      <span className="text-green-700 dark:text-green-400 flex items-center gap-2 text-base"><CheckCircle className="h-5 w-5" /> Schedule Confirmed</span>
                      <button className="text-primary hover:underline flex items-center gap-1.5"><Clock className="h-4 w-4" /> Reschedule</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
