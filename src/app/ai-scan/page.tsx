"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  Stethoscope,
  Info,
  ShieldAlert,
  Sprout,
  HelpCircle,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { classifyCropLeaf } from "@/lib/crop-classifier/classifier";
import { ClassificationResult, CropSpecies } from "@/lib/crop-classifier/types";

export default function AiScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<CropSpecies>("auto");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active scan ID to prevent stale async responses from overwriting latest result
  const activeScanIdRef = useRef<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);

      // Clean reset of previous diagnostic results when a new image is loaded
      setResult(null);
      setIsScanning(false);
      setScanStep("");
      activeScanIdRef.current += 1;
    }
  };

  const handleReset = () => {
    setPreview(null);
    setFile(null);
    setResult(null);
    setIsScanning(false);
    setScanStep("");
    activeScanIdRef.current += 1;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startScan = async (overrideCrop?: CropSpecies) => {
    if (!preview) return;

    const cropToUse = overrideCrop || selectedCrop;
    const currentScanId = ++activeScanIdRef.current;
    setIsScanning(true);
    setResult(null);

    setScanStep("Verifying image quality & leaf tissue...");
    await new Promise((r) => setTimeout(r, 600));
    if (activeScanIdRef.current !== currentScanId) return;

    setScanStep("Establishing crop species boundaries...");
    await new Promise((r) => setTimeout(r, 600));
    if (activeScanIdRef.current !== currentScanId) return;

    setScanStep("Analyzing symptom patterns & lesion morphology...");
    await new Promise((r) => setTimeout(r, 600));
    if (activeScanIdRef.current !== currentScanId) return;

    try {
      const classification = await classifyCropLeaf({
        imageSrc: preview,
        selectedCrop: cropToUse
      });

      if (activeScanIdRef.current === currentScanId) {
        setResult(classification);
      }
    } catch {
      if (activeScanIdRef.current === currentScanId) {
        setResult({
          status: "error",
          selectedCrop: cropToUse,
          quality: {
            isValid: false,
            isBlurry: false,
            blurScore: 0,
            hasLeafTissue: false,
            leafTissueScore: 0
          },
          message: "An unexpected error occurred while analyzing the image. Please try again.",
          timestamp: new Date().toISOString()
        });
      }
    } finally {
      if (activeScanIdRef.current === currentScanId) {
        setIsScanning(false);
        setScanStep("");
      }
    }
  };

  return (
    <div className="flex-grow bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight flex items-center justify-center gap-3">
            <Stethoscope className="h-10 w-10 text-primary" />
            AI Crop Doctor
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a clear photo of an affected leaf for validated species detection, disease diagnosis,
            and extension-verified treatment recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-8">
          {/* Diagnostic Scan & Upload Section */}
          <div className="glassmorphism rounded-3xl p-6 sm:p-8 flex flex-col h-full border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Diagnostic Scan</h2>
              <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">
                ICAR Vetted Rules
              </span>
            </div>

            {/* Crop Species Selector */}
            <div className="mb-5 bg-card/60 p-3.5 rounded-2xl border border-border">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Target Crop Species
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: "auto", label: "Auto-detect" },
                  { id: "maize", label: "Maize (Corn)" },
                  { id: "tomato", label: "Tomato" },
                  { id: "potato", label: "Potato" },
                  { id: "unsupported", label: "Other Crop" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const newCrop = item.id as CropSpecies;
                      setSelectedCrop(newCrop);
                      setResult(null);
                      if (preview) {
                        startScan(newCrop);
                      } else {
                        activeScanIdRef.current += 1;
                        setIsScanning(false);
                        setScanStep("");
                      }
                    }}
                    className={`py-2 px-2 text-xs font-bold rounded-xl transition-all border ${
                      selectedCrop === item.id
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                {selectedCrop === "maize" && "Strictly restricted to Maize disease classes (Rust, Blight, GLS, Healthy)."}
                {selectedCrop === "tomato" && "Strictly restricted to Tomato disease classes (Blights, Spots, Viruses, Healthy)."}
                {selectedCrop === "potato" && "Strictly restricted to Potato disease classes (Early Blight, Late Blight, Healthy)."}
                {selectedCrop === "auto" && "System will verify crop species before matching symptoms."}
                {selectedCrop === "unsupported" && "Non-supported crops will safely direct you to your local KVK."}
              </p>
            </div>

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
                className="flex-grow border-2 border-dashed border-primary/40 rounded-2xl flex flex-col items-center justify-center p-10 text-center cursor-pointer hover:bg-primary/5 transition-all group min-h-[280px]"
              >
                <div className="bg-primary/20 p-5 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="h-10 w-10 text-primary" />
                </div>
                <p className="text-foreground font-semibold text-xl mb-1">Tap to upload or take photo</p>
                <p className="text-sm text-muted-foreground">Supports JPG, PNG up to 10MB</p>
                <p className="text-xs text-primary/80 mt-3 font-medium">
                  Tip: Hold camera close to affected leaf in good daylight
                </p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6 bg-black/5 min-h-[280px]">
                <img src={preview} alt="Crop preview" className="w-full h-[280px] object-cover" />
                <button
                  onClick={handleReset}
                  className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 backdrop-blur-md transition-colors"
                  title="Upload another photo"
                >
                  <Upload className="h-5 w-5" />
                </button>

                {isScanning && (
                  <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm flex flex-col items-center justify-center text-white px-4 text-center">
                    <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin mb-4 shadow-xl"></div>
                    <p className="font-bold text-lg drop-shadow-md text-white mb-1">Analyzing Leaf Sample...</p>
                    <p className="text-xs text-white/90 font-medium bg-black/30 px-3 py-1 rounded-full">{scanStep}</p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => startScan()}
              disabled={!file || isScanning}
              className="mt-6 w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98]"
            >
              {isScanning ? "Evaluating Crop..." : result ? "Re-analyze Leaf" : "Analyze Crop"}
            </button>
          </div>

          {/* Results & Diagnosis Section */}
          <div className="h-full">
            <AnimatePresence mode="wait">
              {/* State 1: Awaiting Image */}
              {!result && !isScanning && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[420px] glassmorphism rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-70 border-dashed border-2 border-border"
                >
                  <Leaf className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Awaiting Image</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Select your crop type and upload an image. Verified diagnosis, confidence score, and treatment
                    guidelines will appear here.
                  </p>
                </motion.div>
              )}

              {/* State 2: Diagnosis Complete */}
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full min-h-[420px] glassmorphism rounded-3xl p-6 sm:p-8 space-y-6 bg-card border-border border-2 shadow-xl"
                >
                  {/* --- Case: Confirmed Disease --- */}
                  {result.status === "success" && result.guidance && (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 uppercase tracking-wider">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              Disease Detected
                            </span>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                              {result.guidance.crop}
                            </span>
                          </div>
                          <h2 className="text-2xl font-bold text-foreground leading-tight">
                            {result.guidance.disease}
                          </h2>
                          <p className="text-xs italic text-muted-foreground mt-0.5">
                            {result.guidance.scientificName}
                          </p>
                        </div>
                        <div className="text-right bg-primary/10 px-4 py-2.5 rounded-2xl border border-primary/20">
                          <div className="text-2xl font-black text-primary">{result.guidance.confidencePercent}</div>
                          <div className="text-[10px] text-primary/80 uppercase tracking-widest font-bold">
                            {result.guidance.confidenceLevel} Confidence
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-border w-full"></div>

                      <div className="space-y-5">
                        {/* Symptoms Observed */}
                        <div>
                          <h3 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                            <Sprout className="h-4 w-4" /> Observed Symptoms
                          </h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/90">
                            {result.guidance.symptoms.map((symptom, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Cause */}
                        <div>
                          <h3 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                            <FlaskConical className="h-4 w-4" /> Cause
                          </h3>
                          <p className="text-sm text-foreground leading-relaxed">{result.guidance.cause}</p>
                        </div>

                        {/* Recommended Chemical Treatment */}
                        <div className="bg-primary/5 rounded-2xl p-4 sm:p-5 border border-primary/20 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                          <h3 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-2">
                            <CheckCircle2 className="h-4 w-4" /> Recommended Extension Treatment
                          </h3>
                          <p className="text-sm text-foreground leading-relaxed font-medium mb-3">
                            {result.guidance.treatment}
                          </p>

                          {/* Organic Alternative */}
                          {result.guidance.organicTreatment && (
                            <div className="mt-3 pt-3 border-t border-primary/15 text-xs text-muted-foreground">
                              <span className="font-bold text-foreground">Organic / Bio-control: </span>
                              {result.guidance.organicTreatment}
                            </div>
                          )}
                        </div>

                        {/* Cultural Prevention */}
                        <div>
                          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                            Cultural Prevention
                          </h3>
                          <p className="text-sm text-foreground leading-relaxed">{result.guidance.prevention}</p>
                        </div>

                        {/* Extension Reference & Advisory Warning */}
                        <div className="bg-muted/40 p-3.5 rounded-xl border border-border text-xs text-muted-foreground space-y-1.5">
                          <div className="flex items-center gap-1.5 font-semibold text-foreground">
                            <BookOpen className="h-3.5 w-3.5 text-primary" /> Reference: {result.guidance.referenceSource}
                          </div>
                          <div className="flex items-start gap-1.5 text-[11px] leading-tight text-amber-600 dark:text-amber-400">
                            <ShieldAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <span>{result.guidance.advisoryNote}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* --- Case: Confirmed Healthy Leaf --- */}
                  {result.status === "healthy" && result.guidance && (
                    <div className="space-y-6 text-center py-4">
                      <div className="inline-flex p-4 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full mb-2">
                        <CheckCircle2 className="h-12 w-12" />
                      </div>
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 uppercase tracking-wider mb-2">
                          Healthy Leaf Confirmed
                        </span>
                        <h2 className="text-2xl font-bold text-foreground">{result.guidance.disease}</h2>
                        <p className="text-xs italic text-muted-foreground mt-0.5">{result.guidance.scientificName}</p>
                      </div>

                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-left text-sm space-y-3">
                        <h3 className="font-bold text-emerald-700 dark:text-emerald-300 text-xs uppercase tracking-wider">
                          Agronomic Assessment
                        </h3>
                        <p className="text-foreground leading-relaxed">
                          No pathogenic fungal, bacterial, or viral disease lesions were detected on this leaf sample.
                          Chlorophyll distribution and leaf turgor are consistent with a vigorous, healthy crop.
                        </p>
                        <p className="text-xs text-muted-foreground font-medium pt-2 border-t border-emerald-500/20">
                          {result.guidance.treatment}
                        </p>
                      </div>

                      <div className="text-left text-xs text-muted-foreground p-3.5 bg-muted/40 rounded-xl border border-border">
                        <span className="font-semibold text-foreground">Scouting Recommendation: </span>
                        {result.guidance.prevention}
                      </div>
                    </div>
                  )}

                  {/* --- Case: Uncertain Prediction --- */}
                  {result.status === "uncertain" && (
                    <div className="space-y-5 py-2">
                      <div className="flex items-center gap-3 p-4 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-amber-700 dark:text-amber-300">
                        <HelpCircle className="h-8 w-8 shrink-0" />
                        <div>
                          <h3 className="font-bold text-base leading-tight">
                            {result.cropDetectionStatus === "conflict"
                              ? "Crop Conflict Detected"
                              : result.cropDetectionStatus === "ambiguous"
                              ? "Crop Identification Uncertain"
                              : "Diagnosis Uncertain"}
                          </h3>
                          <p className="text-xs mt-1 leading-relaxed">{result.message}</p>
                        </div>
                      </div>

                      {/* Explicit Species Conflict Alert */}
                      {result.cropConflictWarning && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="font-bold uppercase tracking-wider block">Crop Species Mismatch</span>
                            <p className="leading-relaxed">{result.cropConflictWarning}</p>
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-muted/30 rounded-2xl border border-border space-y-3 text-sm">
                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                          Why was the diagnosis uncertain?
                        </h4>
                        <ul className="list-disc list-inside space-y-1.5 text-xs text-muted-foreground">
                          {result.cropDetectionStatus === "ambiguous" ? (
                            <>
                              <li>Crop species could not be reliably determined from leaf venation.</li>
                              <li>Please manually select whether this is Maize (Corn) or Tomato above.</li>
                              <li>To protect crop health, GRAM_AI refuses to guess arbitrary diseases.</li>
                            </>
                          ) : result.cropDetectionStatus === "conflict" ? (
                            <>
                              <li>Visual leaf morphology conflicts with the selected crop species.</li>
                              <li>Disease symptoms are withheld to prevent hazardous misapplications.</li>
                              <li>Please switch the target crop button above to match your actual crop.</li>
                            </>
                          ) : (
                            <>
                              <li>Symptom features did not cross the verified confidence threshold (&ge; 60%).</li>
                              <li>Multiple overlapping symptoms or irregular leaf damage may be present.</li>
                              <li>To protect crop health, GRAM_AI refuses to guess an arbitrary disease.</li>
                            </>
                          )}
                        </ul>
                      </div>

                      {/* Closest Partial Matches (Unverified) - strictly isolated to resolved crop */}
                      {result.cropDetectionStatus !== "ambiguous" &&
                        result.cropDetectionStatus !== "conflict" &&
                        result.topCandidates &&
                        result.topCandidates.length > 0 && (
                          <div className="p-4 bg-card rounded-2xl border border-border text-xs">
                            <span className="font-bold text-foreground block mb-2">
                              Closest Partial Matches (Unverified) for{" "}
                              {result.detectedCrop === "maize" || result.selectedCrop === "maize"
                                ? "Maize (Corn)"
                                : "Tomato"}
                              :
                            </span>
                            <div className="space-y-1.5">
                              {result.topCandidates
                                .filter(
                                  (c) =>
                                    c.cropId === (result.detectedCrop || result.selectedCrop)
                                )
                                .map((c, i) => (
                                  <div key={i} className="flex justify-between text-muted-foreground">
                                    <span>{c.name}</span>
                                    <span className="font-mono">{Math.round(c.probability * 100)}% match</span>
                                  </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-muted-foreground/80 mt-2 italic">
                              Note: These unverified partial scores indicate mathematical symptom proximity, not a confirmed diagnosis.
                            </p>
                          </div>
                        )}

                      {/* Helpful message when no partial matches are eligible or crop is uncertain */}
                      {(!result.topCandidates ||
                        result.topCandidates.length === 0 ||
                        result.cropDetectionStatus === "ambiguous" ||
                        result.cropDetectionStatus === "conflict") && (
                        <div className="p-3.5 bg-muted/20 rounded-xl border border-border text-xs text-muted-foreground flex items-center gap-2">
                          <Info className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span>
                            {result.cropDetectionStatus === "conflict"
                              ? "No disease matches displayed due to crop species conflict. Please select the correct crop."
                              : result.cropDetectionStatus === "ambiguous"
                              ? "Crop identification is uncertain. Select Maize (Corn), Tomato, or Potato and re-analyze the image."
                              : `No reliable disease matches found for ${
                                  result.detectedCrop === "maize" || result.selectedCrop === "maize"
                                    ? "Maize"
                                    : result.detectedCrop === "tomato" || result.selectedCrop === "tomato"
                                    ? "Tomato"
                                    : result.detectedCrop === "potato" || result.selectedCrop === "potato"
                                    ? "Potato"
                                    : "crop"
                                }. Please upload a clearer image or consult an agricultural expert.`}
                          </span>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-xl">
                        Please take another photo in brighter natural daylight, ensure the single leaf fills the frame,
                        and select your crop species above.
                      </div>
                    </div>
                  )}

                  {/* --- Case: Unsupported Crop --- */}
                  {result.status === "unsupported_crop" && (
                    <div className="space-y-5 py-2">
                      <div className="flex items-center gap-3 p-4 bg-blue-500/15 border border-blue-500/30 rounded-2xl text-blue-700 dark:text-blue-300">
                        <Info className="h-8 w-8 shrink-0" />
                        <div>
                          <h3 className="font-bold text-base leading-tight">Unsupported Crop Species</h3>
                          <p className="text-xs mt-1 leading-relaxed">{result.message}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-2xl border border-border text-sm space-y-3">
                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                          Supported Crops in GRAM_AI
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          GRAM_AI currently provides agronomically validated classification for:
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-foreground">
                          <div className="p-2.5 bg-card rounded-xl border border-border">
                            🌽 Maize (Corn)
                          </div>
                          <div className="p-2.5 bg-card rounded-xl border border-border">
                            🍅 Tomato
                          </div>
                          <div className="p-2.5 bg-card rounded-xl border border-border">
                            🥔 Potato
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          To avoid dangerous agricultural misdiagnoses, unsupported crops cannot be processed through
                          the maize/tomato/potato classifiers.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* --- Case: Quality / Blur Error --- */}
                  {result.status === "quality_error" && (
                    <div className="space-y-5 py-2">
                      <div className="flex items-center gap-3 p-4 bg-red-500/15 border border-red-500/30 rounded-2xl text-red-700 dark:text-red-300">
                        <AlertTriangle className="h-8 w-8 shrink-0" />
                        <div>
                          <h3 className="font-bold text-base leading-tight">Image Quality Issue</h3>
                          <p className="text-xs mt-1 leading-relaxed">{result.message}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-2xl border border-border space-y-3 text-xs text-muted-foreground">
                        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                          Photo Guidelines for Accurate Diagnosis:
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Hold the smartphone steady to avoid motion blur.</li>
                          <li>Ensure the leaf fills at least 50% of the camera frame.</li>
                          <li>Avoid strong flash glare or deep shadows.</li>
                          <li>Clean the camera lens of dust or moisture.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* --- Case: General Error --- */}
                  {result.status === "error" && (
                    <div className="space-y-4 py-4 text-center">
                      <AlertTriangle className="h-10 w-10 text-red-500 mx-auto" />
                      <h3 className="font-bold text-base text-foreground">Analysis Could Not Complete</h3>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">{result.message}</p>
                      <button
                        onClick={() => startScan()}
                        className="py-2.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

