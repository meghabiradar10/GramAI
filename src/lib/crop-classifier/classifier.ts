
/**
 * Agricultural Crop Disease Classification Pipeline
 * Supports Maize, Tomato, and Potato model classes.
 * Preserves crop isolation and uncertainty safeguards.
 */

import {
  ClassificationInput,
  ClassificationResult,
  DiagnosisStatus,
  SupportedCrop,
} from './types';
import { CROP_DISEASE_KNOWLEDGE_BASE } from './knowledge-base';
import { extractFeaturesFromImageSrc, VisualFeatures } from './image-analyzer';
import { runModelInference, ModelInferenceResult } from './model-inference';

export const UNCERTAINTY_THRESHOLD = 0.55;
export const MARGIN_UNCERTAINTY_THRESHOLD = 0.08;

const SUPPORTED_CROPS: SupportedCrop[] = ['maize', 'tomato', 'potato'];

function isSupportedCrop(value: string): value is SupportedCrop {
  return SUPPORTED_CROPS.includes(value as SupportedCrop);
}

function cropDisplayName(crop: SupportedCrop): string {
  if (crop === 'maize') return 'Maize (Corn)';
  if (crop === 'tomato') return 'Tomato';
  return 'Potato';
}

function cropPredictions(
  crop: SupportedCrop,
  modelResult: ModelInferenceResult
) {
  if (crop === 'maize') return modelResult.maizePredictions;
  if (crop === 'tomato') return modelResult.tomatoPredictions;
  return modelResult.potatoPredictions;
}

export async function classifyCropLeaf(
  input: ClassificationInput
): Promise<ClassificationResult> {
  const timestamp = new Date().toISOString();
  const selectedCrop = input.selectedCrop || 'auto';

  if (!input.imageSrc || input.imageSrc.trim() === '') {
    return {
      status: 'error',
      selectedCrop,
      quality: {
        isValid: false,
        isBlurry: false,
        blurScore: 0,
        hasLeafTissue: false,
        leafTissueScore: 0,
        reason: 'No image provided for diagnostic scan.',
      },
      message: 'Please provide a valid crop image.',
      timestamp,
    };
  }

  if (selectedCrop === 'unsupported') {
    return {
      status: 'unsupported_crop',
      selectedCrop,
      cropDetectionStatus: 'unsupported',
      quality: {
        isValid: true,
        isBlurry: false,
        blurScore: 1,
        hasLeafTissue: true,
        leafTissueScore: 1,
      },
      message:
        'This crop is not supported by the selected diagnostic workflow. Please choose Maize, Tomato, or Potato, or consult your nearest Krishi Vigyan Kendra (KVK).',
      timestamp,
    };
  }

  let features: VisualFeatures;

  try {
    features = await extractFeaturesFromImageSrc(input.imageSrc);
  } catch {
    return {
      status: 'error',
      selectedCrop,
      quality: {
        isValid: false,
        isBlurry: false,
        blurScore: 0,
        hasLeafTissue: false,
        leafTissueScore: 0,
        reason: 'Failed to process image payload.',
      },
      message: 'Failed to process image file. Please re-upload.',
      timestamp,
    };
  }

  if (!features.quality.isValid) {
    return {
      status: 'quality_error',
      selectedCrop,
      cropDetectionStatus: 'ambiguous',
      quality: features.quality,
      message:
        features.quality.reason ||
        'Please upload a clear image of a crop leaf and try again.',
      timestamp,
    };
  }

  let modelResult: ModelInferenceResult;

  try {
    modelResult = input.mockModelResult ?? (await runModelInference(input.imageSrc));
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : 'unknown error';

    return {
      status: 'error',
      selectedCrop,
      quality: features.quality,
      message: `Model inference could not be completed: ${detail}. Please verify the image and model files.`,
      timestamp,
    };
  }

  const modelCrop = modelResult.detectedCrop;
  const topModelCrop = modelResult.topPrediction.crop;
  const detectedSpecies =
    modelResult.detectedCropSpecies ||
    (modelCrop === 'other' ? 'an unsupported crop' : cropDisplayName(modelCrop));

  // Do not let a high score for an unsupported species enter a supported
  // crop's disease list.
  const isStrongUnsupportedModel =
    topModelCrop === 'other' &&
    (modelResult.topPrediction.probability >= 0.25 ||
      modelResult.otherProbMass >= 0.70);

  if (isStrongUnsupportedModel) {
    const expectedCrop = isSupportedCrop(selectedCrop)
      ? cropDisplayName(selectedCrop)
      : undefined;

    return {
      status: 'unsupported_crop',
      selectedCrop,
      detectedCrop: 'unsupported',
      cropDetectionStatus: 'unsupported',
      quality: features.quality,
      message: expectedCrop
        ? `The model's strongest prediction appears to be ${detectedSpecies}, not a verified ${expectedCrop} diagnosis. Please upload a clear ${expectedCrop} leaf image or consult your nearest KVK.`
        : `The model's strongest prediction appears to be ${detectedSpecies}. Please select the correct crop and upload a clear leaf image.`,
      timestamp,
    };
  }

  // Potato has no independent morphology classifier in this pipeline.
  // Require explicit Potato selection rather than claiming automatic
  // botanical confirmation based only on the model prediction.
  if (
    selectedCrop === 'auto' &&
    (modelCrop === 'potato' || topModelCrop === 'potato')
  ) {
    return {
      status: 'uncertain',
      selectedCrop,
      detectedCrop: 'potato',
      cropDetectionStatus: 'ambiguous',
      quality: features.quality,
      message:
        'The model suggests Potato. Please select Potato explicitly and re-analyze the image so the crop choice can be checked before showing disease guidance.',
      topCandidates: modelResult.potatoPredictions.slice(0, 3),
      timestamp,
    };
  }

  // Preserve the existing Maize/Tomato morphology conflict safeguards.
  if (
    selectedCrop === 'maize' &&
    (features.dominantCropCandidate === 'tomato' ||
      (modelCrop === 'tomato' && features.reticulateVeinScore > 0.30))
  ) {
    return {
      status: 'uncertain',
      selectedCrop,
      detectedCrop: 'tomato',
      cropDetectionStatus: 'conflict',
      cropConflictWarning:
        'The model or leaf morphology indicates Tomato rather than Maize. Maize disease guidance was blocked.',
      quality: features.quality,
      message:
        'Crop conflict detected. Please confirm that the uploaded leaf is Maize before proceeding.',
      timestamp,
    };
  }

  if (
    selectedCrop === 'tomato' &&
    (features.dominantCropCandidate === 'maize' ||
      (modelCrop === 'maize' &&
        modelResult.cropConfidence >= 0.50 &&
        (features.aspectRatio > 1.30 ||
          features.parallelVeinScore > 0.10)))
  ) {
    return {
      status: 'uncertain',
      selectedCrop,
      detectedCrop: 'maize',
      cropDetectionStatus: 'conflict',
      cropConflictWarning:
        'The model or leaf morphology indicates Maize rather than Tomato. Tomato disease guidance was blocked.',
      quality: features.quality,
      message:
        'Crop conflict detected. Please confirm that the uploaded leaf is Tomato before proceeding.',
      timestamp,
    };
  }

  let resolvedCrop: SupportedCrop;
  let cropDetectionStatus:
    | 'confirmed'
    | 'user_selected'
    | 'conflict'
    | 'ambiguous'
    | 'unsupported';

  if (isSupportedCrop(selectedCrop)) {
    // An explicit crop choice is not proof that the model agrees.
    if (
      topModelCrop !== selectedCrop &&
      modelResult.cropConfidence >= 0.60 &&
      isSupportedCrop(topModelCrop)
    ) {
      return {
        status: 'uncertain',
        selectedCrop,
        detectedCrop: topModelCrop,
        cropDetectionStatus: 'conflict',
        cropConflictWarning:
          `The model's strongest crop prediction is ${cropDisplayName(topModelCrop)}, not ${cropDisplayName(selectedCrop)}. Disease guidance was blocked.`,
        quality: features.quality,
        message:
          'The selected crop and model prediction do not agree. Please check the image and crop selection.',
        timestamp,
      };
    }

    resolvedCrop = selectedCrop;
    cropDetectionStatus =
      topModelCrop === selectedCrop ? 'confirmed' : 'user_selected';
  } else {
    // Auto-detect Maize and Tomato using the existing morphology rules.
    if (
      features.dominantCropCandidate === 'maize' ||
      (modelCrop === 'maize' &&
        modelResult.cropConfidence >= 0.60 &&
        (features.aspectRatio > 1.30 ||
          features.parallelVeinScore > 0.10))
    ) {
      resolvedCrop = 'maize';
      cropDetectionStatus = 'confirmed';
    } else if (
      features.dominantCropCandidate === 'tomato' ||
      (modelCrop === 'tomato' &&
        modelResult.cropConfidence >= 0.60 &&
        features.reticulateVeinScore > 0.20)
    ) {
      resolvedCrop = 'tomato';
      cropDetectionStatus = 'confirmed';
    } else {
      return {
        status: 'uncertain',
        selectedCrop,
        cropDetectionStatus: 'ambiguous',
        quality: features.quality,
        message:
          'Crop identification is uncertain. Select Maize (Corn), Tomato, or Potato and re-analyze the image.',
        timestamp,
      };
    }
  }

  let probabilities = cropPredictions(resolvedCrop, modelResult).filter(
    (candidate) => candidate.cropId === resolvedCrop
  );

  const isPhysiologicallyHealthy =
    features.vegetativeRatio > 0.70 &&
    features.necroticRatio < 0.03 &&
    features.chloroticRatio < 0.04 &&
    features.rustPustuleRatio < 0.01;

  if (isPhysiologicallyHealthy) {
    const healthyId =
      resolvedCrop === 'maize'
        ? 'maize_healthy'
        : resolvedCrop === 'tomato'
          ? 'tomato_healthy'
          : 'potato_healthy';

    const topDisease = probabilities.find(
      (candidate) => candidate.diseaseId !== healthyId
    );

    if (!topDisease || topDisease.probability < 0.65) {
      probabilities = probabilities
        .map((candidate) =>
          candidate.diseaseId === healthyId
            ? { ...candidate, probability: Math.max(candidate.probability, 0.88) }
            : {
                ...candidate,
                probability: Number(
                  (candidate.probability * 0.12).toFixed(4)
                ),
              }
        )
        .sort((a, b) => b.probability - a.probability);
    }
  }

  if (probabilities.length === 0) {
    return {
      status: 'uncertain',
      selectedCrop,
      detectedCrop: resolvedCrop,
      cropDetectionStatus,
      quality: features.quality,
      message: 'No supported disease classes could be matched for this crop.',
      timestamp,
    };
  }

  const topCandidate = probabilities[0];
  const secondCandidate = probabilities[1];
  const topMargin = secondCandidate
    ? topCandidate.probability - secondCandidate.probability
    : 1;

  const hasVisibleSymptoms =
    features.chloroticRatio > 0.05 ||
    features.necroticRatio > 0.03 ||
    features.rustPustuleRatio > 0.01;

  const cropMass =
    resolvedCrop === 'maize'
      ? modelResult.maizeProbMass
      : resolvedCrop === 'tomato'
        ? modelResult.tomatoProbMass
        : modelResult.potatoProbMass;

  const hasLowCropMass =
    !isPhysiologicallyHealthy &&
    cropMass < 0.30 &&
    topModelCrop !== resolvedCrop;

  const isHealthyCandidate = topCandidate.diseaseId.endsWith('_healthy');

  const isUncertain =
    topCandidate.probability < UNCERTAINTY_THRESHOLD ||
    (topMargin < MARGIN_UNCERTAINTY_THRESHOLD && !isHealthyCandidate) ||
    (isHealthyCandidate && hasVisibleSymptoms) ||
    hasLowCropMass;

  if (isUncertain) {
    return {
      status: 'uncertain',
      selectedCrop,
      detectedCrop: resolvedCrop,
      cropDetectionStatus,
      quality: features.quality,
      message:
        'Unable to identify the disease reliably. Please upload a clear leaf image and verify the crop selection.',
      topCandidates: probabilities.slice(0, 3),
      timestamp,
    };
  }

  const baseGuidance = CROP_DISEASE_KNOWLEDGE_BASE[topCandidate.diseaseId];

  if (!baseGuidance) {
    return {
      status: 'error',
      selectedCrop,
      detectedCrop: resolvedCrop,
      cropDetectionStatus,
      quality: features.quality,
      message:
        'Disease definition is missing from the knowledge base. No diagnosis guidance was returned.',
      timestamp,
    };
  }

  if (baseGuidance.cropId !== resolvedCrop) {
    return {
      status: 'error',
      selectedCrop,
      detectedCrop: resolvedCrop,
      cropDetectionStatus,
      quality: features.quality,
      message: 'Integrity check failure: cross-crop diagnosis was blocked.',
      timestamp,
    };
  }

  const confidencePercent = `${Math.round(topCandidate.probability * 100)}%`;
  const confidenceLevel: 'High' | 'Moderate' | 'Low' =
    topCandidate.probability >= 0.80
      ? 'High'
      : topCandidate.probability >= 0.65
        ? 'Moderate'
        : 'Low';

  const fullGuidance = {
    ...baseGuidance,
    confidence: Number(topCandidate.probability.toFixed(3)),
    confidencePercent,
    confidenceLevel,
  };

  const finalStatus: DiagnosisStatus = fullGuidance.isHealthy
    ? 'healthy'
    : 'success';

  return {
    status: finalStatus,
    selectedCrop,
    detectedCrop: resolvedCrop,
    cropDetectionStatus,
    guidance: fullGuidance,
    quality: features.quality,
    message: fullGuidance.isHealthy
      ? 'Healthy leaf detected. No chemical disease treatment is necessary.'
      : `Disease detected: ${fullGuidance.disease} with ${confidencePercent} confidence.`,
    topCandidates: probabilities.slice(0, 3),
    timestamp,
  };
}

