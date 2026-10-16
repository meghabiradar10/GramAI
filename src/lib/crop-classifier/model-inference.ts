
import * as ort from 'onnxruntime-web';
import type { DiseaseId, DiseaseProbability, SupportedCrop } from './types';

if (typeof window !== 'undefined') {
  ort.env.wasm.wasmPaths = '/onnx/';
  ort.env.wasm.numThreads = 1;
}

export interface ModelPrediction {
  classIndex: number;
  label: string;
  crop: SupportedCrop | 'other';
  diseaseId?: DiseaseId;
  probability: number;
}

export function extractCropSpeciesName(label: string): string {
  if (label.includes('Corn') || label.includes('Maize')) return 'Maize (Corn)';
  if (label.includes('Tomato')) return 'Tomato';
  if (label.includes('Potato')) return 'Potato';
  if (label.includes('Soybean')) return 'Soybean';
  if (label.includes('Apple')) return 'Apple';
  if (label.includes('Blueberry')) return 'Blueberry';
  if (label.includes('Cherry')) return 'Cherry';
  if (label.includes('Grape')) return 'Grape';
  if (label.includes('Orange') || label.includes('Citrus')) return 'Orange';
  if (label.includes('Peach')) return 'Peach';
  if (label.includes('Pepper')) return 'Bell Pepper';
  if (label.includes('Raspberry')) return 'Raspberry';
  if (label.includes('Squash')) return 'Squash';
  if (label.includes('Strawberry')) return 'Strawberry';
  return 'an unsupported crop';
}

export interface ModelInferenceResult {
  isModelInference: true;
  detectedCrop: SupportedCrop | 'other';
  detectedCropSpecies?: string;
  cropConfidence: number;
  maizeProbMass: number;
  tomatoProbMass: number;
  potatoProbMass: number;
  otherProbMass: number;
  topPrediction: ModelPrediction;
  allPredictions: ModelPrediction[];
  maizePredictions: DiseaseProbability[];
  tomatoPredictions: DiseaseProbability[];
  potatoPredictions: DiseaseProbability[];
}

export const PLANTVILLAGE_TAXONOMY: Array<{
  index: number;
  label: string;
  crop: SupportedCrop | 'other';
  diseaseId?: DiseaseId;
}> = [
  { index: 0, label: 'Apple Scab', crop: 'other' },
  { index: 1, label: 'Apple with Black Rot', crop: 'other' },
  { index: 2, label: 'Cedar Apple Rust', crop: 'other' },
  { index: 3, label: 'Healthy Apple', crop: 'other' },
  { index: 4, label: 'Healthy Blueberry Plant', crop: 'other' },
  { index: 5, label: 'Cherry with Powdery Mildew', crop: 'other' },
  { index: 6, label: 'Healthy Cherry Plant', crop: 'other' },
  { index: 7, label: 'Corn (Maize) with Cercospora and Gray Leaf Spot', crop: 'maize', diseaseId: 'maize_gray_leaf_spot' },
  { index: 8, label: 'Corn (Maize) with Common Rust', crop: 'maize', diseaseId: 'maize_common_rust' },
  { index: 9, label: 'Corn (Maize) with Northern Leaf Blight', crop: 'maize', diseaseId: 'maize_northern_leaf_blight' },
  { index: 10, label: 'Healthy Corn (Maize) Plant', crop: 'maize', diseaseId: 'maize_healthy' },
  { index: 11, label: 'Grape with Black Rot', crop: 'other' },
  { index: 12, label: 'Grape with Esca (Black Measles)', crop: 'other' },
  { index: 13, label: 'Grape with Isariopsis Leaf Spot', crop: 'other' },
  { index: 14, label: 'Healthy Grape Plant', crop: 'other' },
  { index: 15, label: 'Orange with Citrus Greening', crop: 'other' },
  { index: 16, label: 'Peach with Bacterial Spot', crop: 'other' },
  { index: 17, label: 'Healthy Peach Plant', crop: 'other' },
  { index: 18, label: 'Bell Pepper with Bacterial Spot', crop: 'other' },
  { index: 19, label: 'Healthy Bell Pepper Plant', crop: 'other' },
  { index: 20, label: 'Potato with Early Blight', crop: 'potato', diseaseId: 'potato_early_blight' },
  { index: 21, label: 'Potato with Late Blight', crop: 'potato', diseaseId: 'potato_late_blight' },
  { index: 22, label: 'Healthy Potato Plant', crop: 'potato', diseaseId: 'potato_healthy' },
  { index: 23, label: 'Healthy Raspberry Plant', crop: 'other' },
  { index: 24, label: 'Healthy Soybean Plant', crop: 'other' },
  { index: 25, label: 'Squash with Powdery Mildew', crop: 'other' },
  { index: 26, label: 'Strawberry with Leaf Scorch', crop: 'other' },
  { index: 27, label: 'Healthy Strawberry Plant', crop: 'other' },
  { index: 28, label: 'Tomato with Bacterial Spot', crop: 'tomato', diseaseId: 'tomato_bacterial_spot' },
  { index: 29, label: 'Tomato with Early Blight', crop: 'tomato', diseaseId: 'tomato_early_blight' },
  { index: 30, label: 'Tomato with Late Blight', crop: 'tomato', diseaseId: 'tomato_late_blight' },
  { index: 31, label: 'Tomato with Leaf Mold', crop: 'tomato', diseaseId: 'tomato_leaf_mold' },
  { index: 32, label: 'Tomato with Septoria Leaf Spot', crop: 'tomato', diseaseId: 'tomato_septoria_leaf_spot' },
  { index: 33, label: 'Tomato with Spider Mites or Two-spotted Spider Mite', crop: 'tomato' },
  { index: 34, label: 'Tomato with Target Spot', crop: 'tomato' },
  { index: 35, label: 'Tomato Yellow Leaf Curl Virus', crop: 'tomato', diseaseId: 'tomato_yellow_leaf_curl_virus' },
  { index: 36, label: 'Tomato Mosaic Virus', crop: 'tomato', diseaseId: 'tomato_mosaic_virus' },
  { index: 37, label: 'Healthy Tomato Plant', crop: 'tomato', diseaseId: 'tomato_healthy' },
];

let cachedSession: ort.InferenceSession | null = null;
let sessionLoadingPromise: Promise<ort.InferenceSession> | null = null;

export async function getInferenceSession(): Promise<ort.InferenceSession> {
  if (cachedSession) return cachedSession;
  if (sessionLoadingPromise) return sessionLoadingPromise;

  sessionLoadingPromise = (async () => {
    const isBrowser = typeof window !== 'undefined';
    const modelPath = isBrowser
      ? '/models/plant-disease/model.onnx'
      : './public/models/plant-disease/model.onnx';

    try {
      const session = await ort.InferenceSession.create(modelPath, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      });
      cachedSession = session;
      return session;
    } catch {
      const fallbackPath = isBrowser
        ? '/models/plant-disease/model_quantized.onnx'
        : './public/models/plant-disease/model_quantized.onnx';
      const session = await ort.InferenceSession.create(fallbackPath, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      });
      cachedSession = session;
      return session;
    } finally {
      sessionLoadingPromise = null;
    }
  })();

  return sessionLoadingPromise;
}

export async function preprocessImageToTensor(imageSrc: string): Promise<ort.Tensor> {
  const width = 224;
  const height = 224;
  const floats = new Float32Array(3 * width * height);

  if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Canvas 2D context unavailable'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const data = ctx.getImageData(0, 0, width, height).data;

          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const src = (y * width + x) * 4;
              const pixel = y * width + x;
              floats[pixel] = data[src] / 127.5 - 1;
              floats[width * height + pixel] = data[src + 1] / 127.5 - 1;
              floats[2 * width * height + pixel] = data[src + 2] / 127.5 - 1;
            }
          }

          resolve(new ort.Tensor('float32', floats, [1, 3, height, width]));
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image for tensor preprocessing'));
      img.src = imageSrc;
    });
  }

  if (imageSrc.startsWith('data:image/raw-rgba;')) {
    const comma = imageSrc.indexOf(',');
    const meta = imageSrc.slice(0, comma);
    const buffer = Buffer.from(imageSrc.slice(comma + 1), 'base64');
    const origW = Number(meta.match(/w=(\d+)/)?.[1] ?? 64);
    const origH = Number(meta.match(/h=(\d+)/)?.[1] ?? 64);

    for (let y = 0; y < height; y++) {
      const sy = Math.min(origH - 1, Math.floor((y / height) * origH));
      for (let x = 0; x < width; x++) {
        const sx = Math.min(origW - 1, Math.floor((x / width) * origW));
        const src = (sy * origW + sx) * 4;
        const pixel = y * width + x;
        floats[pixel] = buffer[src] / 127.5 - 1;
        floats[width * height + pixel] = buffer[src + 1] / 127.5 - 1;
        floats[2 * width * height + pixel] = buffer[src + 2] / 127.5 - 1;
      }
    }

    return new ort.Tensor('float32', floats, [1, 3, height, width]);
  }

  if (imageSrc.startsWith('data:image/')) {
    const comma = imageSrc.indexOf(',');
    const buffer = Buffer.from(imageSrc.slice(comma + 1), 'base64');
    if (buffer.length === 0) throw new Error('Empty image payload');

    const side = Math.max(1, Math.floor(Math.sqrt(buffer.length / 4)));

    for (let y = 0; y < height; y++) {
      const sy = Math.min(side - 1, Math.floor((y / height) * side));
      for (let x = 0; x < width; x++) {
        const sx = Math.min(side - 1, Math.floor((x / width) * side));
        const src = ((sy * side + sx) * 4) % buffer.length;
        const pixel = y * width + x;
        floats[pixel] = buffer[src] / 127.5 - 1;
        floats[width * height + pixel] = buffer[(src + 1) % buffer.length] / 127.5 - 1;
        floats[2 * width * height + pixel] = buffer[(src + 2) % buffer.length] / 127.5 - 1;
      }
    }

    return new ort.Tensor('float32', floats, [1, 3, height, width]);
  }

  throw new Error('Unsupported image payload for tensor preprocessing');
}

export async function runModelInference(imageSrc: string): Promise<ModelInferenceResult> {
  const session = await getInferenceSession();
  const tensor = await preprocessImageToTensor(imageSrc);
  const feeds = { [session.inputNames[0]]: tensor };
  const results = await session.run(feeds);
  const logits = Array.from(results[session.outputNames[0]].data as Float32Array);

  const maxLogit = Math.max(...logits);
  const exps = logits.map((value) => Math.exp(value - maxLogit));
  const total = exps.reduce((sum, value) => sum + value, 0);
  const probabilities = exps.map((value) => value / total);

  const allPredictions: ModelPrediction[] = PLANTVILLAGE_TAXONOMY.map((item) => ({
    classIndex: item.index,
    label: item.label,
    crop: item.crop,
    diseaseId: item.diseaseId,
    probability: probabilities[item.index] ?? 0,
  })).sort((a, b) => b.probability - a.probability);

  const topPrediction = allPredictions[0];
  let maizeProbMass = 0;
  let tomatoProbMass = 0;
  let potatoProbMass = 0;
  let otherProbMass = 0;

  for (const prediction of allPredictions) {
    if (prediction.crop === 'maize') maizeProbMass += prediction.probability;
    else if (prediction.crop === 'tomato') tomatoProbMass += prediction.probability;
    else if (prediction.crop === 'potato') potatoProbMass += prediction.probability;
    else otherProbMass += prediction.probability;
  }

  let detectedCrop: SupportedCrop | 'other' = 'other';
  let cropConfidence = topPrediction.probability;

  if (topPrediction.crop === 'maize' && maizeProbMass > 0.40) {
    detectedCrop = 'maize';
    cropConfidence = maizeProbMass;
  } else if (topPrediction.crop === 'tomato' && tomatoProbMass > 0.40) {
    detectedCrop = 'tomato';
    cropConfidence = tomatoProbMass;
  } else if (topPrediction.crop === 'potato' && potatoProbMass > 0.40) {
    detectedCrop = 'potato';
    cropConfidence = potatoProbMass;
  } else {
    cropConfidence = otherProbMass;
  }

  function buildPredictions(crop: SupportedCrop): DiseaseProbability[] {
    const classes = allPredictions.filter((item) => item.crop === crop && item.diseaseId);
    const sum = classes.reduce((acc, item) => acc + item.probability, 0);

    return classes.map((item) => ({
      diseaseId: item.diseaseId!,
      name: item.label
        .replace(/^(Corn \(Maize\)|Tomato|Potato)( with)? /, '')
        .replace(/Plant$/, '')
        .trim(),
      cropId: crop,
      probability: Number((sum > 0.05 ? item.probability / sum : item.probability).toFixed(4)),
    })).sort((a, b) => b.probability - a.probability);
  }

  return {
    isModelInference: true,
    detectedCrop,
    detectedCropSpecies: extractCropSpeciesName(topPrediction.label),
    cropConfidence: Number(cropConfidence.toFixed(4)),
    maizeProbMass: Number(maizeProbMass.toFixed(4)),
    tomatoProbMass: Number(tomatoProbMass.toFixed(4)),
    potatoProbMass: Number(potatoProbMass.toFixed(4)),
    otherProbMass: Number(otherProbMass.toFixed(4)),
    topPrediction,
    allPredictions,
    maizePredictions: buildPredictions('maize'),
    tomatoPredictions: buildPredictions('tomato'),
    potatoPredictions: buildPredictions('potato'),
  };
}


