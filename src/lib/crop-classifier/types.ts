/**
 * Core Domain Types and Schemas for GRAM_AI Crop Doctor
 * Enforces strict crop boundaries, quality thresholds, and diagnostic schemas.
 */

export type SupportedCrop = 'maize' | 'tomato' | 'potato';
export type CropSpecies = SupportedCrop | 'unsupported' | 'auto';

export type MaizeDiseaseId =
  | 'maize_common_rust'
  | 'maize_northern_leaf_blight'
  | 'maize_gray_leaf_spot'
  | 'maize_healthy';

export type TomatoDiseaseId =
  | 'tomato_late_blight'
  | 'tomato_early_blight'
  | 'tomato_bacterial_spot'
  | 'tomato_septoria_leaf_spot'
  | 'tomato_leaf_mold'
  | 'tomato_yellow_leaf_curl_virus'
  | 'tomato_mosaic_virus'
  | 'tomato_healthy';

export type PotatoDiseaseId =
  | 'potato_early_blight'
  | 'potato_late_blight'
  | 'potato_healthy';



export type DiseaseId = MaizeDiseaseId | TomatoDiseaseId | PotatoDiseaseId;

export type DiagnosisStatus =
  | 'success'           // High-confidence confirmed disease
  | 'healthy'           // Confirmed healthy crop leaf
  | 'uncertain'         // Low confidence, ambiguous symptoms, or uncertain crop
  | 'unsupported_crop'  // Crop not supported by the verified model
  | 'quality_error'     // Blurry, bad lighting, or no plant leaf visible
  | 'error';            // Network / processing failure

export interface QualityCheckResult {
  isValid: boolean;
  isBlurry: boolean;
  blurScore: number;       // 0 to 1, higher = sharper
  hasLeafTissue: boolean;
  leafTissueScore: number; // 0 to 1, higher = more plant tissue
  reason?: string;
}

export interface AgriculturalGuidance {
  crop: string;
  cropId: SupportedCrop;
  disease: string;
  diseaseId: DiseaseId;
  scientificName: string;
  isHealthy: boolean;
  confidence: number;            // Calibrated probability 0.0 - 1.0
  confidencePercent: string;     // Formatted percentage string (e.g., "89%")
  confidenceLevel: 'High' | 'Moderate' | 'Low' | 'Uncertain';
  symptoms: string[];
  cause: string;
  severity: 'None' | 'Low' | 'Moderate' | 'High' | 'Severe';
  treatment: string;
  organicTreatment: string;
  prevention: string;
  referenceSource: string;
  advisoryNote: string;
}

export interface DiseaseProbability {
  diseaseId: DiseaseId;
  name: string;
  cropId: SupportedCrop;
  probability: number;
}

export interface ClassificationResult {
  status: DiagnosisStatus;
  selectedCrop: CropSpecies;
  detectedCrop?: SupportedCrop | 'unsupported';
  cropDetectionStatus?: 'confirmed' | 'user_selected' | 'conflict' | 'ambiguous' | 'unsupported';
  cropConflictWarning?: string;
  guidance?: AgriculturalGuidance;
  quality: QualityCheckResult;
  message: string;
  topCandidates?: DiseaseProbability[];
  timestamp: string;
}

export interface ClassificationInput {
  imageSrc: string;                 // Data URL or image path
  selectedCrop?: CropSpecies;       // User-specified or 'auto'
  fileName?: string;
  fileSizeBytes?: number;
  mockModelResult?: any;
}

