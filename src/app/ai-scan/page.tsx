"use client";

import React, { useState, useRef } from "react";
import { Upload, Camera, Leaf, AlertTriangle, CheckCircle2, FlaskConical, Stethoscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AiScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
    }
  };

  const startScan = () => {
    if (!file) return;
    setIsScanning(true);
    
    // Mock AI Analysis delay
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        disease: "Tomato Late Blight",
        confidence: "94%",
        cause: "Phytophthora infestans (Oomycete fungus)",
        severity: "High",
        treatment: "Apply fungicides containing chlorothalonil or copper. Ensure good air circulation.",
        prevention: "Avoid overhead watering. Plant resistant varieties. Rotate crops yearly."
      });
    }, 3000);
  };

  return (
    <div className="flex-grow bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight flex items-center justify-center gap-3">
            <Stethoscope className="h-10 w-10 text-primary" />
            AI Crop Doctor
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a photo of your infected crop leaf, and our AI will identify the disease and recommend treatments within seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-8">
          
          {/* Upload Section */}
          <div className="glassmorphism rounded-3xl p-6 sm:p-8 flex flex-col h-full border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">Diagnostic Scan</h2>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            
            {!preview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex-grow border-2 border-dashed border-primary/40 rounded-2xl flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:bg-primary/5 transition-all group min-h-[300px]"
              >
                <div className="bg-primary/20 p-5 rounded-full mb-5 group-hover:scale-110 transition-transform">
                  <Camera className="h-10 w-10 text-primary" />
                </div>
                <p className="text-foreground font-semibold text-xl mb-2">Tap to upload or take photo</p>
                <p className="text-sm text-muted-foreground">Supports JPG, PNG up to 10MB</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6 bg-black/5 min-h-[300px]">
                <img src={preview} alt="Crop preview" className="w-full h-[300px] object-cover" />
                <button 
                  onClick={() => { setPreview(null); setFile(null); setResult(null); }}
                  className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 backdrop-blur-md transition-colors"
                >
                  <Upload className="h-5 w-5" />
                </button>
                
                {isScanning && (
                  <div className="absolute inset-0 bg-primary/30 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4 shadow-xl"></div>
                    <p className="font-bold text-xl drop-shadow-md text-white">Analyzing with AI...</p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={startScan}
              disabled={!file || isScanning || result !== null}
              className="mt-6 w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98]"
            >
              {isScanning ? "Processing Image..." : result ? "Analysis Complete" : "Analyze Crop"}
            </button>
          </div>

          {/* Results Section */}
          <div className="h-full">
            <AnimatePresence mode="wait">
              {!result && !isScanning && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] glassmorphism rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-70 border-dashed border-2 border-border"
                >
                  <Leaf className="h-20 w-20 text-muted-foreground mb-6 opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Awaiting Image</h3>
                  <p className="text-base text-muted-foreground max-w-sm">Analysis results will appear here after scanning a crop image.</p>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full min-h-[400px] glassmorphism rounded-3xl p-6 sm:p-8 space-y-6 bg-card border-primary/20 border-2 shadow-xl shadow-primary/5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 mb-3 uppercase tracking-wider">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Disease Detected
                      </span>
                      <h2 className="text-2xl font-bold text-foreground leading-tight">{result.disease}</h2>
                    </div>
                    <div className="text-right bg-primary/10 px-4 py-2 rounded-2xl">
                      <div className="text-3xl font-black text-primary">{result.confidence}</div>
                      <div className="text-xs text-primary/80 uppercase tracking-widest font-bold">Match</div>
                    </div>
                  </div>

                  <div className="h-px bg-border w-full"></div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">
                        <FlaskConical className="h-4 w-4" /> Cause
                      </h3>
                      <p className="text-foreground text-base leading-relaxed">{result.cause}</p>
                    </div>
                    
                    <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                      <h3 className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-widest mb-3">
                        <CheckCircle2 className="h-5 w-5" /> Recommended Treatment
                      </h3>
                      <p className="text-foreground text-base leading-relaxed font-medium">{result.treatment}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Prevention</h3>
                      <p className="text-foreground text-base leading-relaxed">{result.prevention}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
