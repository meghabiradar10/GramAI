"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, HelpCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function GovtBuddyPage() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: "Namaskar! I am your Govt Buddy AI. I can help you find and apply for agriculture schemes in Maharashtra. Ask me anything in English, Marathi, or Hindi!",
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      let botResponse = "";
      
      if (userMessage.content.toLowerCase().includes("pm kisan")) {
        botResponse = `Yes, PM Kisan (Pradhan Mantri Kisan Samman Nidhi) provides ₹6,000 per year to eligible farmers in three equal installments.

**Eligibility:** Small and marginal farmers with cultivable landholding.

**Documents Needed:**
• Aadhaar Card
• Bank Account details
• Land ownership papers (7/12 extract)

Would you like help applying for this?`;
      } else {
        botResponse = "I have noted your query. Based on your profile in Maharashtra, you might also be eligible for the 'Mahadbt' farmer umbrella schemes. Would you like me to detail those out?";
      }

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: botResponse,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
      setIsTyping(false);
    }, 2000);
  };

  const suggestedQuestions = [
    "What is PM Kisan?",
    "माझ्यासाठी कोणत्या योजना आहेत?",
    "How to apply for tractor subsidy?"
  ];

  return (
    <div className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 lg:p-8 gap-6 h-[calc(100vh-5rem)]">
      
      {/* Sidebar - Schemes Directory */}
      <div className="hidden md:flex flex-col w-1/3 glassmorphism rounded-3xl p-6 border-border overflow-y-auto">
        <div className="flex items-center gap-2 mb-8 text-primary">
          <FileText className="h-7 w-7" />
          <h2 className="text-2xl font-bold">Top Schemes</h2>
        </div>
        
        <div className="space-y-4">
          {[
            { name: "PM Kisan Samman Nidhi", tag: "₹6,000/year", desc: "Direct income support" },
            { name: "MahaDBT Tractor Subsidy", tag: "Up to 50%", desc: "Farm mechanization" },
            { name: "PM Fasal Bima Yojana", tag: "Crop Insurance", desc: "Coverage from natural calamities" },
            { name: "Kisan Credit Card", tag: "Low Interest Loan", desc: "Short term credit limits" },
          ].map((scheme, i) => (
            <div key={i} className="p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer group shadow-sm hover:shadow-md hover:-translate-y-1">
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg mb-1">{scheme.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{scheme.desc}</p>
              <span className="text-xs text-primary font-bold bg-primary/10 inline-block px-3 py-1.5 rounded-lg">{scheme.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-grow w-full glassmorphism rounded-3xl border-border overflow-hidden bg-card/50 shadow-xl relative">
        {/* Chat Header */}
        <div className="bg-card border-b border-border p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2.5 rounded-full">
              <Bot className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">Govt Buddy AI</h1>
              <p className="text-sm text-green-600 font-medium flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                Online & Ready
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-transparent to-primary/5">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}>
                  {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-6 w-6" />}
                </div>
                
                <div className={`p-4 sm:p-5 shadow-md ${
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-3xl rounded-br-sm" 
                    : "glassmorphism bg-white/90 dark:bg-[#064e3b]/90 border-border text-foreground rounded-3xl rounded-bl-sm"
                }`}>
                  <div className="whitespace-pre-line text-[15px] sm:text-base leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground mt-2 mx-14">{msg.timestamp}</span>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end gap-3"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                <Bot className="h-6 w-6" />
              </div>
              <div className="p-5 rounded-3xl glassmorphism bg-white/90 dark:bg-card/90 border-border rounded-bl-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce delay-75"></span>
                <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce delay-150"></span>
              </div>
            </motion.div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="bg-card border-t border-border p-4 sm:p-5">
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="text-sm font-medium bg-muted/50 hover:bg-muted text-foreground border border-border px-4 py-2 rounded-xl transition-all flex items-center gap-2 hover:border-primary/40 focus:ring-2 focus:ring-primary/20"
              >
                <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                {q}
              </button>
            ))}
          </div>
          
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Govt Buddy (e.g., 'PM Kisan kya hai?')..."
              className="w-full pl-5 pr-14 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-foreground text-base transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:bg-muted-foreground transition-all shadow-sm active:scale-95"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
