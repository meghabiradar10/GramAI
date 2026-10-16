/**
 * Image Quality and Visual Feature Analyzer
 * Evaluates blurriness, leaf tissue presence, morphological venation, and lesion patterns.
 * Designed to execute cleanly in browser Canvas contexts and Node.js testing environments.
 */

import { QualityCheckResult, SupportedCrop } from './types';

export interface VisualFeatures {
  quality: QualityCheckResult;
  averageBrightness: number;
  vegetativeRatio: number;      // Fraction of pixels matching plant chlorophyll
  necroticRatio: number;         // Fraction of leaf showing brown/black dead tissue
  chloroticRatio: number;        // Fraction of leaf showing yellowing
  rustPustuleRatio: number;      // Fraction showing reddish-cinnamon rust pustules
  parallelVeinScore: number;     // 0 to 1: indicates monocot parallel venation (Maize)
  reticulateVeinScore: number;   // 0 to 1: indicates dicot netted venation (Tomato)
  aspectRatio: number;
  dominantCropCandidate: SupportedCrop | 'unknown';
  cropConfidence?: number;
  maizeScore?: number;
  tomatoScore?: number;
  midribRatio?: number;
}

/**
 * Core image feature extraction from raw RGBA pixel data
 */
export function analyzePixelData(
  pixels: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number
): VisualFeatures {
  const totalPixels = width * height;
  if (totalPixels === 0 || pixels.length < totalPixels * 4) {
    return createInvalidVisualFeatures('Image buffer is empty or corrupted');
  }

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;

  let plantPixels = 0;
  let necroticPixels = 0;
  let chloroticPixels = 0;
  let rustPustulePixels = 0;
  let midribPixels = 0;

  // Grayscale intensity buffer for Laplacian variance (blur check) and gradient analysis
  const gray = new Float32Array(totalPixels);

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const r = pixels[idx];
    const g = pixels[idx + 1];
    const b = pixels[idx + 2];

    totalR += r;
    totalG += g;
    totalB += b;

    // Luminance formula
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    gray[i] = lum;

    // Excess Green Index (ExG): 2*G - R - B
    const exg = 2 * g - r - b;

    // RGB to approximate HSV for chlorophyll and symptom detection
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;
    if (delta > 0) {
      if (max === r) hue = ((g - b) / delta) % 6;
      else if (max === g) hue = (b - r) / delta + 2;
      else hue = (r - g) / delta + 4;
      hue = Math.round(hue * 60);
      if (hue < 0) hue += 360;
    }
    const sat = max === 0 ? 0 : delta / max;

    // 1. Plant tissue detection (green chlorophyll: Hue 40° to 165°, or dominant G)
    const isGreenPlant = (g > r * 1.02 && g > b) || (hue >= 38 && hue <= 165 && sat > 0.12) || (exg > 8 && g > 40);
    // 2. Rust pustules (reddish/terracotta/cinnamon brown: r > 110, g between 35 and 135, b < 80, r > g * 1.15)
    const isRustPustule = r > 110 && g >= 35 && g <= 135 && b < 80 && r > g * 1.15;
    // 3. Yellowing / Chlorosis (Hue 35° to 62°, high saturation, bright)
    const isChlorotic = !isRustPustule && (hue >= 35 && hue <= 62 && sat > 0.25 && lum > 75);
    // 4. Necrotic / Blight lesions (dark brown to black dead tissue: strictly non-green)
    const isNecrotic = !isGreenPlant && !isRustPustule && !isChlorotic && (
      (r > g && lum < 100 && (r - b) > 5) || (lum < 60 && lum > 10)
    );
    // 5. Pale central midrib typical of monocot / maize blade
    const isMidrib = isGreenPlant && lum > 125 && sat < 0.32 && g > 105 && g > b * 1.08;

    if (isGreenPlant || isChlorotic || isRustPustule || isNecrotic || isMidrib) {
      plantPixels++;
      if (isRustPustule) rustPustulePixels++;
      else if (isNecrotic) necroticPixels++;
      else if (isChlorotic) chloroticPixels++;
      if (isMidrib) midribPixels++;
    }
  }

  const avgBrightness = (totalR + totalG + totalB) / (3 * totalPixels * 255);
  const vegetativeRatio = plantPixels / totalPixels;

  // -------------------------------------------------------------
  // Laplacian Variance Blurriness Check
  // High variance = sharp edges; low variance = blurry
  // -------------------------------------------------------------
  let laplacianSum = 0;
  let laplacianSumSq = 0;
  let edgesCount = 0;

  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      const idx = y * width + x;
      // Discrete Laplacian kernel: [0, 1, 0; 1, -4, 1; 0, 1, 0]
      const lap =
        gray[idx - width] +
        gray[idx + width] +
        gray[idx - 1] +
        gray[idx + 1] -
        4 * gray[idx];

      laplacianSum += lap;
      laplacianSumSq += lap * lap;
      edgesCount++;
    }
  }

  const lapMean = edgesCount > 0 ? laplacianSum / edgesCount : 0;
  const lapVar = edgesCount > 0 ? laplacianSumSq / edgesCount - lapMean * lapMean : 0;

  // Real Laplacian variance threshold: textured leaf >= 0.8; flat/blurred images < 0.8
  const isBlurry = lapVar < 0.8;
  const blurScore = Math.min(1.0, Math.max(0.0, lapVar / 40.0));

  // Leaf presence validation
  const hasLeafTissue = vegetativeRatio >= 0.18;

  let qualityReason: string | undefined;
  if (!hasLeafTissue) {
    qualityReason = 'No crop leaf detected in image. Please ensure a plant leaf fills the photo.';
  } else if (isBlurry) {
    qualityReason = 'Image is too blurry to detect symptoms accurately. Please upload a sharper photo.';
  } else if (avgBrightness < 0.08) {
    qualityReason = 'Image is too dark. Please take the photo in good natural daylight.';
  } else if (avgBrightness > 0.94) {
    qualityReason = 'Image is overexposed. Please avoid severe flash glare.';
  }

  const isValidQuality = !isBlurry && hasLeafTissue && avgBrightness >= 0.08 && avgBrightness <= 0.94;

  // -------------------------------------------------------------
  // Morphological Feature Estimation (Maize vs Tomato)
  // Decoupled independent feature extraction with Structure Tensor Anisotropy
  // -------------------------------------------------------------
  let horizontalGradient = 0;
  let verticalGradient = 0;
  let diagonalGradient1 = 0;
  let diagonalGradient2 = 0;

  // Structure tensor accumulators for rotation-invariant anisotropy
  let Jxx = 0, Jyy = 0, Jxy = 0;
  let edgePixelCount = 0;
  let totalSamplePoints = 0;

  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      totalSamplePoints++;
      const idx = y * width + x;
      const gx = gray[idx + 1] - gray[idx - 1];
      const gy = gray[idx + width] - gray[idx - width];
      const gd1 = Math.abs(gray[idx + width + 1] - gray[idx - width - 1]);
      const gd2 = Math.abs(gray[idx + width - 1] - gray[idx - width + 1]);

      const absGx = Math.abs(gx);
      const absGy = Math.abs(gy);

      horizontalGradient += absGx;
      verticalGradient += absGy;
      diagonalGradient1 += gd1;
      diagonalGradient2 += gd2;

      Jxx += gx * gx;
      Jyy += gy * gy;
      Jxy += gx * gy;

      if (Math.hypot(gx, gy) > 12) {
        edgePixelCount++;
      }
    }
  }

  const axialGrad = horizontalGradient + verticalGradient + 1e-5;
  const diagonalGrad = diagonalGradient1 + diagonalGradient2 + 1e-5;
  const totalGrad = axialGrad + diagonalGrad;

  // 1. Parallel Venation (Rotation-Invariant Anisotropy + Axial Dominance)
  const T = Jxx + Jyy + 1e-5;
  const diff = Math.sqrt((Jxx - Jyy) * (Jxx - Jyy) + 4 * Jxy * Jxy);
  const tensorAnisotropy = diff / T;

  const axialDominance = Math.abs(horizontalGradient - verticalGradient) / axialGrad;
  const directionalScore = Math.max(tensorAnisotropy, axialDominance);
  const parallelVeinScore = Math.min(1.0, Math.max(0, (directionalScore - 0.18) * 2.2));

  const validPlantPixels = Math.max(1, plantPixels);
  const rustPustuleRatio = rustPustulePixels / validPlantPixels;
  const necroticRatio = necroticPixels / validPlantPixels;
  const chloroticRatio = chloroticPixels / validPlantPixels;
  const midribRatio = midribPixels / validPlantPixels;

  // 2. Reticulate / Netted Branching Venation (Dicot / Tomato):
  // True reticulate netted venation is a pervasive interconnected network across the leaf tissue,
  // which requires continuous spatial edge coverage across the blade (unlike isolated spot lesions).
  const samplePoints = Math.max(1, totalSamplePoints);
  const meanEdgeStrength = totalGrad / samplePoints;

  const minAxis = Math.min(horizontalGradient, verticalGradient);
  const maxAxis = Math.max(horizontalGradient, verticalGradient);
  const axialBalance = minAxis / (maxAxis + 1e-5);

  const minDiag = Math.min(diagonalGradient1, diagonalGradient2);
  const maxDiag = Math.max(diagonalGradient1, diagonalGradient2);
  const diagBalance = minDiag / (maxDiag + 1e-5);

  const diagToAxial = Math.min(diagonalGrad, axialGrad) / (Math.max(diagonalGrad, axialGrad) + 1e-5);
  const multiAngleMeshScore = axialBalance * diagBalance * diagToAxial;
  const edgeTextureFactor = Math.min(1.0, Math.max(0, (meanEdgeStrength - 10.0) / 10.0));

  // Widespread network density requirement: netted veins cover >= 25% of the leaf surface
  const edgeCoverage = edgePixelCount / samplePoints;
  const meshDensityFactor = Math.min(1.0, Math.max(0, (edgeCoverage - 0.20) / 0.15));

  const reticulateVeinScore = Math.min(
    1.0,
    multiAngleMeshScore * 1.5 * edgeTextureFactor * meshDensityFactor * Math.max(0, 1.0 - parallelVeinScore * 2.0)
  );

  const aspectRatio = Number((width / height).toFixed(2));
  const isElongated = aspectRatio > 1.35 || aspectRatio < 0.74;

  // Independent Evidence Scores
  // Maize: elongated geometry, parallel venation, or prominent central midrib
  let maizeScore = parallelVeinScore * 2.5;
  if (isElongated && parallelVeinScore > 0.10) maizeScore += 1.0;
  if (midribRatio > 0.025) maizeScore += 1.0;

  // Tomato: reticulate multi-angle venation
  let tomatoScore = reticulateVeinScore * 2.5;

  // Normalization via Softmax for crop candidates with unrepresented crop baseline prior
  const expMaize = Math.exp(maizeScore / 0.8);
  const expTomato = Math.exp(tomatoScore / 0.8);
  const expOther = Math.exp(1.1 / 0.8); // Baseline prior ensuring neither dominates on smooth/neutral images
  const sumExp = expMaize + expTomato + expOther;

  const maizeProb = expMaize / sumExp;
  const tomatoProb = expTomato / sumExp;

  let dominantCropCandidate: SupportedCrop | 'unknown' = 'unknown';
  let cropConfidence = 0;

  // Strict species gate: require >= 0.65 probability AND clear margin of >= 0.20
  if (maizeProb >= 0.65 && (maizeProb - tomatoProb) >= 0.20) {
    dominantCropCandidate = 'maize';
    cropConfidence = Number(maizeProb.toFixed(3));
  } else if (tomatoProb >= 0.65 && (tomatoProb - maizeProb) >= 0.20) {
    dominantCropCandidate = 'tomato';
    cropConfidence = Number(tomatoProb.toFixed(3));
  } else {
    dominantCropCandidate = 'unknown';
    cropConfidence = Number(Math.max(maizeProb, tomatoProb).toFixed(3));
  }

  return {
    quality: {
      isValid: isValidQuality,
      isBlurry,
      blurScore: Number(blurScore.toFixed(3)),
      hasLeafTissue,
      leafTissueScore: Number(vegetativeRatio.toFixed(3)),
      reason: qualityReason
    },
    averageBrightness: Number(avgBrightness.toFixed(3)),
    vegetativeRatio: Number(vegetativeRatio.toFixed(3)),
    necroticRatio: Number(necroticRatio.toFixed(3)),
    chloroticRatio: Number(chloroticRatio.toFixed(3)),
    rustPustuleRatio: Number(rustPustuleRatio.toFixed(3)),
    midribRatio: Number(midribRatio.toFixed(3)),
    parallelVeinScore: Number(parallelVeinScore.toFixed(3)),
    reticulateVeinScore: Number(reticulateVeinScore.toFixed(3)),
    aspectRatio,
    dominantCropCandidate,
    cropConfidence,
    maizeScore: Number(maizeScore.toFixed(3)),
    tomatoScore: Number(tomatoScore.toFixed(3))
  };
}

function createInvalidVisualFeatures(reason: string): VisualFeatures {
  return {
    quality: {
      isValid: false,
      isBlurry: true,
      blurScore: 0,
      hasLeafTissue: false,
      leafTissueScore: 0,
      reason
    },
    averageBrightness: 0,
    vegetativeRatio: 0,
    necroticRatio: 0,
    chloroticRatio: 0,
    rustPustuleRatio: 0,
    parallelVeinScore: 0,
    reticulateVeinScore: 0,
    aspectRatio: 1,
    dominantCropCandidate: 'unknown'
  };
}

/**
 * Extracts and analyzes an image from an HTML Image or Canvas element
 */
export async function extractFeaturesFromImageSrc(
  imageSrc: string
): Promise<VisualFeatures> {
  // If running in browser with DOM Canvas support
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const targetW = 256;
          const targetH = 256;
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(createInvalidVisualFeatures('Canvas 2D context unavailable'));
            return;
          }
          ctx.drawImage(img, 0, 0, targetW, targetH);
          const imgData = ctx.getImageData(0, 0, targetW, targetH);
          const features = analyzePixelData(imgData.data, targetW, targetH);
          resolve(features);
        } catch {
          resolve(createInvalidVisualFeatures('Failed to process image pixel data'));
        }
      };
      img.onerror = () => {
        resolve(createInvalidVisualFeatures('Failed to load image file'));
      };
      img.src = imageSrc;
    });
  }

  // Node.js test support: direct raw RGBA payload
  if (imageSrc.startsWith('data:image/raw-rgba;')) {
    try {
      const commaIdx = imageSrc.indexOf(',');
      const meta = imageSrc.slice(0, commaIdx);
      const base64Data = imageSrc.slice(commaIdx + 1);
      const wMatch = meta.match(/w=(\d+)/);
      const hMatch = meta.match(/h=(\d+)/);
      const w = wMatch ? parseInt(wMatch[1], 10) : 64;
      const h = hMatch ? parseInt(hMatch[1], 10) : 64;
      const buffer = Buffer.from(base64Data, 'base64');
      const pixels = new Uint8ClampedArray(buffer.buffer, buffer.byteOffset, buffer.length);
      return analyzePixelData(pixels, w, h);
    } catch {
      return createInvalidVisualFeatures('Corrupted raw RGBA image data');
    }
  }

  // Node.js fallback for standard base64 strings
  if (imageSrc.startsWith('data:image/')) {
    try {
      const commaIdx = imageSrc.indexOf(',');
      const base64Data = imageSrc.slice(commaIdx + 1);
      const buffer = Buffer.from(base64Data, 'base64');
      if (buffer.length < 200) {
        return createInvalidVisualFeatures('Image file is too small or corrupted');
      }
      const side = Math.max(16, Math.floor(Math.sqrt(buffer.length / 4)));
      const samplePixels = new Uint8ClampedArray(side * side * 4);
      for (let i = 0; i < samplePixels.length; i++) {
        samplePixels[i] = buffer[i % buffer.length];
      }
      return analyzePixelData(samplePixels, side, side);
    } catch {
      return createInvalidVisualFeatures('Corrupted base64 image data');
    }
  }

  return createInvalidVisualFeatures('Invalid image source');
}
