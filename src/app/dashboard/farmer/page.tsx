"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Wallet, TrendingUp, ShoppingBag, Calendar, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FarmerDashboard() {
  const expenseData = [
    { month: "Jan", expenses: 4000, income: 6000 },
    { month: "Feb", expenses: 3000, income: 5500 },
    { month: "Mar", expenses: 5000, income: 8000 },
    { month: "Apr", expenses: 4500, income: 7500 },
    { month: "May", expenses: 6000, income: 10000 },
    { month: "Jun", expenses: 3500, income: 9000 },
  ];

  const recentOrders = [
    { id: "#ORD-001", items: "Premium Wheat Seeds", date: "Oct 12, 2023", amount: "₹850", status: "Delivered" },
    { id: "#ORD-002", items: "Urea Fertilizer 50kg", date: "Oct 08, 2023", amount: "₹950", status: "Processing" },
  ];

  const upcomingBookings = [
    { id: "#BKG-104", service: "Tractor (Cultivator)", provider: "Raju Patil", date: "Oct 15, 2023", time: "08:00 AM" },
  ];

  return (
    <div className="flex-grow bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Farmer Dashboard</h1>
            <p className="text-muted-foreground mt-2 font-medium">Welcome back! Here's an overview of your farm operations.</p>
          </div>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95">
            Add New Expense
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Income", amount: "₹46,000", icon: <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-500" />, trend: "+12%" },
            { title: "Total Expenses", amount: "₹26,000", icon: <Wallet className="h-6 w-6 text-red-600 dark:text-red-500" />, trend: "+5%" },
            { title: "Active Orders", amount: "2", icon: <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-500" />, trend: "" },
            { title: "Upcoming Bookings", amount: "1", icon: <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-500" />, trend: "" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glassmorphism bg-card border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="p-3 bg-muted/50 rounded-xl shadow-sm border border-border/50">{stat.icon}</div>
                {stat.trend && (
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md shadow-sm ${stat.trend.startsWith('+') && stat.title.includes('Income') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-muted-foreground font-bold text-sm tracking-wide uppercase mb-1">{stat.title}</h3>
                <h2 className="text-3xl font-black text-foreground">{stat.amount}</h2>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 glassmorphism bg-card border-border rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Income vs Expenses</h2>
              <select className="bg-muted border border-border text-sm font-bold rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-foreground cursor-pointer transition-all">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="flex-grow h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={expenseData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 600, fontSize: 13}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 600, fontSize: 13}} tickFormatter={(value) => `₹${value/1000}k`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#0f172a', marginBottom: '8px' }}
                  />
                  <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={4} dot={{r: 5, strokeWidth: 2}} activeDot={{r: 8}} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={4} dot={{r: 5, strokeWidth: 2}} activeDot={{r: 8}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-8">
            {/* Upcoming Bookings */}
            <div className="glassmorphism bg-card border-border rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Your Bookings</h2>
                <button className="text-primary text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {upcomingBookings.map((bk) => (
                  <div key={bk.id} className="p-5 rounded-2xl bg-muted/30 border border-border flex flex-col gap-3 hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md uppercase">{bk.id}</span>
                      <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary/70"/> {bk.date}</span>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-foreground text-lg">{bk.service}</h3>
                      <p className="text-sm text-muted-foreground font-semibold mt-0.5">Provider: {bk.provider}</p>
                    </div>
                    <div className="mt-2 pt-3 border-t border-border text-sm font-bold flex items-center justify-between">
                      <span className="text-foreground">Time: <span className="text-primary">{bk.time}</span></span>
                      <button className="text-primary hover:text-primary/70 transition-colors flex items-center gap-1">Details <ArrowUpRight className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="glassmorphism bg-card border-border rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
                <button className="text-primary text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {recentOrders.map((ord) => (
                  <div key={ord.id} className="flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/50 rounded-2xl transition-all cursor-pointer border border-border hover:border-primary/30">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-xl shadow-sm">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm leading-tight mb-1">{ord.items}</h4>
                        <p className="text-xs text-muted-foreground font-semibold">{ord.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-foreground text-base mb-1">{ord.amount}</div>
                      <div className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${ord.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {ord.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
