/**
 * Automated Test Suite for GRAM_AI Crop Doctor
 * Validates the 10 core requirements:
 * 1. Maize leaf with supported maize disease
 * 2. Tomato leaf with supported tomato disease
 * 3. Healthy maize leaf
 * 4. Healthy tomato leaf
 * 5. Unsupported crop rejection
 * 6. Blurry or non-leaf image rejection
 * 7. Low-confidence / uncertain prediction handling
 * 8. Missing / empty image payload
 * 9. Corrupted image payload
 * 10. Sequential image upload state isolation
 * + Strict cross-crop isolation check (Maize can NEVER be diagnosed with Tomato disease)
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { classifyCropLeaf, UNCERTAINTY_THRESHOLD } from '../dist-test/classifier.js';
import { CROP_DISEASE_KNOWLEDGE_BASE } from '../dist-test/knowledge-base.js';

console.log('🌱 Starting GRAM_AI Crop Classifier Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] Test ${totalTests}: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`✅ [PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] Test ${totalTests}: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

/**
 * Generates synthetic RGBA test image payloads in Data URL format
 */
function createSyntheticImageDataUrl(options) {
  const {
    width = 64,
    height = 64,
    baseColor = [40, 140, 40], // Green plant
    symptomType = 'none',       // 'rust' | 'necrotic' | 'chlorotic' | 'blurry' | 'non_plant' | 'ambiguous'
    venation = 'none',          // 'none' | 'parallel' | 'reticulate'
  } = options;

  const totalPixels = width * height;
  const buffer = Buffer.alloc(totalPixels * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      if (symptomType === 'non_plant') {
        // Metallic gray/indoor object
        buffer[idx] = 180;
        buffer[idx + 1] = 180;
        buffer[idx + 2] = 180;
        buffer[idx + 3] = 255;
        continue;
      }

      if (symptomType === 'blurry') {
        // Uniform solid color without high-frequency edge gradients
        buffer[idx] = 50;
        buffer[idx + 1] = 120;
        buffer[idx + 2] = 50;
        buffer[idx + 3] = 255;
        continue;
      }

      // Base healthy leaf background with isotropic noise (balanced across R, G, B)
      const noise = (Math.sin(x * 0.4) * Math.cos(y * 0.4)) * 3;
      let r = baseColor[0] + noise;
      let g = baseColor[1] + noise;
      let b = baseColor[2] + noise;

      // Add venation gradients
      if (venation === 'parallel') {
        // High vertical striping: creates huge horizontal gradient (gx), almost zero vertical gradient (gy)
        if (x % 3 === 0) {
          r = Math.max(0, r - 40);
          g = Math.max(0, g - 40);
          b = Math.max(0, b - 20);
        }
      } else if (venation === 'reticulate') {
        // Balanced multi-directional netted branching
        if ((x % 4 === 0) || (y % 4 === 0) || ((x + y) % 5 === 0) || ((x - y + 100) % 5 === 0)) {
          r = Math.max(0, r - 35);
          g = Math.max(0, g - 35);
          b = Math.max(0, b - 20);
        }
      }

      if (symptomType === 'rust') {
        // Speckled terracotta/rust pustules on leaf surface
        if ((x % 7 === 0 && y % 5 === 0) || (x % 9 === 0 && y % 8 === 0)) {
          r = 175; // Reddish brown
          g = 85;
          b = 30;
        }
      } else if (symptomType === 'necrotic') {
        // Blight necrotic lesion patch
        if (x > 20 && x < 48 && y > 15 && y < 45) {
          r = 45; // Dark necrotic brown/black
          g = 35;
          b = 25;
        }
      } else if (symptomType === 'ambiguous') {
        // Mixed circular chlorotic spots and small necrotic patches where no single disease dominates
        const d1 = (x - 22)**2 + (y - 24)**2;
        const d2 = (x - 44)**2 + (y - 42)**2;
        const d3 = (x - 28)**2 + (y - 48)**2;
        if (d1 < 12 || d2 < 12) {
          r = 45; g = 35; b = 25; // Small necrotic patch
        } else if (d1 < 45 || d2 < 50 || d3 < 35) {
          r = 160; g = 150; b = 40; // Chlorotic circular spots
        }
      }

      buffer[idx] = Math.min(255, Math.max(0, Math.round(r)));
      buffer[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
      buffer[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
      buffer[idx + 3] = 255;
    }
  }

  return `data:image/raw-rgba;base64;w=${width};h=${height},${buffer.toString('base64')}`;
}

async function main() {
  // -------------------------------------------------------------
  // Test 1: Maize leaf with supported maize disease (Common Rust)
  // -------------------------------------------------------------
  await runAsyncTest('Case 1: Maize leaf with supported maize disease (Common Rust)', async () => {
    const maizeRustImg = createSyntheticImageDataUrl({
      symptomType: 'rust',
      baseColor: [50, 130, 45]
    });

    const result = await classifyCropLeaf({
      imageSrc: maizeRustImg,
      selectedCrop: 'maize'
    });

    assert.strictEqual(result.status, 'success', 'Status should be success');
    assert.ok(result.guidance, 'Guidance report must exist');
    assert.strictEqual(result.guidance.cropId, 'maize', 'Crop must be maize');
    assert.strictEqual(result.guidance.diseaseId, 'maize_common_rust', 'Disease must be maize common rust');
    assert.strictEqual(result.guidance.scientificName, 'Puccinia sorghi', 'Scientific name must be Puccinia sorghi');
    assert.ok(result.guidance.confidence >= UNCERTAINTY_THRESHOLD, 'Confidence must exceed uncertainty threshold');
    assert.ok(result.guidance.treatment.includes('Mancozeb'), 'Treatment must include extension fungicide recommendation');

    // CRITICAL: Maize must NEVER be classified as Tomato Late Blight!
    assert.notStrictEqual(result.guidance.disease, 'Tomato Late Blight', 'Maize must NEVER be Tomato Late Blight');
    assert.notStrictEqual(result.guidance.cropId, 'tomato', 'Maize cropId must NEVER be tomato');
  });

  // -------------------------------------------------------------
  // Test 2: Tomato leaf with supported tomato disease (Late Blight)
  // -------------------------------------------------------------
  await runAsyncTest('Case 2: Tomato leaf with supported tomato disease (Late Blight)', async () => {
    const tomatoBlightImg = createSyntheticImageDataUrl({
      symptomType: 'necrotic',
      baseColor: [45, 125, 40]
    });

    const result = await classifyCropLeaf({
      imageSrc: tomatoBlightImg,
      selectedCrop: 'tomato'
    });

    assert.strictEqual(result.status, 'success', 'Status should be success');
    assert.ok(result.guidance, 'Guidance report must exist');
    assert.strictEqual(result.guidance.cropId, 'tomato', 'Crop must be tomato');
    assert.strictEqual(result.guidance.diseaseId, 'tomato_late_blight', 'Disease must be tomato late blight');
    assert.strictEqual(result.guidance.scientificName, 'Phytophthora infestans');
    assert.ok(result.guidance.treatment.includes('Metalaxyl') || result.guidance.treatment.includes('Ridomil'));
    assert.notStrictEqual(result.guidance.cropId, 'maize', 'Tomato cropId must NEVER be maize');
  });

  // -------------------------------------------------------------
  // Test 3: Healthy maize leaf
  // -------------------------------------------------------------
  await runAsyncTest('Case 3: Healthy maize leaf', async () => {
    const healthyMaizeImg = createSyntheticImageDataUrl({
      symptomType: 'none',
      baseColor: [35, 160, 35] // Vibrant clean green
    });

    const result = await classifyCropLeaf({
      imageSrc: healthyMaizeImg,
      selectedCrop: 'maize'
    });

    assert.strictEqual(result.status, 'healthy', 'Status should be healthy');
    assert.ok(result.guidance, 'Guidance report must exist');
    assert.strictEqual(result.guidance.isHealthy, true, 'isHealthy flag must be true');
    assert.strictEqual(result.guidance.cropId, 'maize');
    assert.ok(result.guidance.treatment.includes('No disease treatment required'), 'Should not prescribe fungicides for healthy leaf');
  });

  // -------------------------------------------------------------
  // Test 4: Healthy tomato leaf
  // -------------------------------------------------------------
  await runAsyncTest('Case 4: Healthy tomato leaf', async () => {
    const healthyTomatoImg = createSyntheticImageDataUrl({
      venation: 'reticulate',
      symptomType: 'none',
      baseColor: [30, 155, 30]
    });

    const result = await classifyCropLeaf({
      imageSrc: healthyTomatoImg,
      selectedCrop: 'tomato'
    });

    assert.strictEqual(result.status, 'healthy', 'Status should be healthy');
    assert.ok(result.guidance, 'Guidance report must exist');
    assert.strictEqual(result.guidance.isHealthy, true);
    assert.strictEqual(result.guidance.cropId, 'tomato');
    assert.ok(result.guidance.disease.includes('Healthy'));
  });

  // -------------------------------------------------------------
  // Test 5: Unsupported crop
  // -------------------------------------------------------------
  await runAsyncTest('Case 5: Unsupported crop (e.g., Wheat, Rice, Cotton)', async () => {
    const anyLeafImg = createSyntheticImageDataUrl({
      symptomType: 'rust',
      baseColor: [40, 140, 40]
    });

    const result = await classifyCropLeaf({
      imageSrc: anyLeafImg,
      selectedCrop: 'unsupported'
    });

    assert.strictEqual(result.status, 'unsupported_crop', 'Status must be unsupported_crop');
    assert.ok(!result.guidance, 'Should not provide guidance for unsupported crop');
    assert.ok(result.message.includes('Krishi Vigyan Kendra') || result.message.includes('only for Maize (Corn) and Tomato'), 'Message must refer user to KVK');
  });

  // -------------------------------------------------------------
  // Test 6: Blurry or non-leaf image
  // -------------------------------------------------------------
  await runAsyncTest('Case 6: Blurry or non-leaf image rejection', async () => {
    // 6a: Non-plant indoor object
    const nonLeafImg = createSyntheticImageDataUrl({
      symptomType: 'non_plant'
    });

    const nonLeafResult = await classifyCropLeaf({
      imageSrc: nonLeafImg,
      selectedCrop: 'maize'
    });

    assert.strictEqual(nonLeafResult.status, 'quality_error', 'Non-leaf image must be rejected');
    assert.strictEqual(nonLeafResult.quality.hasLeafTissue, false, 'hasLeafTissue must be false');

    // 6b: Blurry image
    const blurryImg = createSyntheticImageDataUrl({
      symptomType: 'blurry'
    });

    const blurryResult = await classifyCropLeaf({
      imageSrc: blurryImg,
      selectedCrop: 'maize'
    });

    assert.strictEqual(blurryResult.status, 'quality_error', 'Blurry image must be rejected');
    assert.strictEqual(blurryResult.quality.isBlurry, true, 'isBlurry flag must be true');
  });

  // -------------------------------------------------------------
  // Test 7: Low-confidence / uncertain prediction
  // -------------------------------------------------------------
  await runAsyncTest('Case 7: Low-confidence prediction handling', async () => {
    // Ambiguous image where symptom signals are weak or conflicting
    const ambiguousImg = createSyntheticImageDataUrl({
      symptomType: 'ambiguous',
      baseColor: [60, 110, 60]
    });

    const result = await classifyCropLeaf({
      imageSrc: ambiguousImg,
      selectedCrop: 'maize'
    });

    assert.strictEqual(result.status, 'uncertain', 'Ambiguous symptom should yield uncertain status');
    assert.ok(result.message.includes('Unable to identify the disease reliably'), 'Must display standard uncertainty message');
    assert.ok(result.topCandidates && result.topCandidates.length > 0, 'Should transparently provide top candidates');
  });

  // -------------------------------------------------------------
  // Test 8: Failed request / missing image payload
  // -------------------------------------------------------------
  await runAsyncTest('Case 8: Missing or empty image payload', async () => {
    const result = await classifyCropLeaf({
      imageSrc: '',
      selectedCrop: 'maize'
    });

    assert.strictEqual(result.status, 'error', 'Empty imageSrc must return error status');
    assert.strictEqual(result.quality.isValid, false);
  });

  // -------------------------------------------------------------
  // Test 9: Corrupted image payload
  // -------------------------------------------------------------
  await runAsyncTest('Case 9: Corrupted base64 payload', async () => {
    const corruptedImg = 'data:image/png;base64,not_a_valid_base64_payload_too_short';

    const result = await classifyCropLeaf({
      imageSrc: corruptedImg,
      selectedCrop: 'tomato'
    });

    assert.strictEqual(result.status, 'quality_error', 'Corrupted payload must return quality_error or error');
    assert.strictEqual(result.quality.isValid, false);
  });

  // -------------------------------------------------------------
  // Test 10: Sequential image upload state isolation
  // -------------------------------------------------------------
  await runAsyncTest('Case 10: Sequential upload state isolation (No stale cross-contamination)', async () => {
    // 1st upload: Maize Rust
    const maizeImg = createSyntheticImageDataUrl({
      symptomType: 'rust',
      baseColor: [50, 130, 45]
    });
    const result1 = await classifyCropLeaf({
      imageSrc: maizeImg,
      selectedCrop: 'maize'
    });
    assert.strictEqual(result1.guidance?.cropId, 'maize');
    assert.strictEqual(result1.guidance?.diseaseId, 'maize_common_rust');

    // 2nd upload: Tomato Late Blight
    const tomatoImg = createSyntheticImageDataUrl({
      symptomType: 'necrotic',
      baseColor: [45, 125, 40]
    });
    const result2 = await classifyCropLeaf({
      imageSrc: tomatoImg,
      selectedCrop: 'tomato'
    });
    assert.strictEqual(result2.guidance?.cropId, 'tomato');
    assert.strictEqual(result2.guidance?.diseaseId, 'tomato_late_blight');
    // Verify no maize leak into tomato result
    assert.strictEqual(result2.guidance?.crop, 'Tomato');
    assert.ok(!result2.guidance?.disease.includes('Rust'));

    // 3rd upload: Healthy Maize
    const healthyMaizeImg = createSyntheticImageDataUrl({
      symptomType: 'none',
      baseColor: [35, 160, 35]
    });
    const result3 = await classifyCropLeaf({
      imageSrc: healthyMaizeImg,
      selectedCrop: 'maize'
    });
    assert.strictEqual(result3.status, 'healthy');
    assert.strictEqual(result3.guidance?.isHealthy, true);
    assert.strictEqual(result3.guidance?.cropId, 'maize');
    // Verify no tomato/blight leak into healthy maize result
    assert.ok(!result3.guidance?.disease.includes('Blight'));
  });

  // -------------------------------------------------------------
  // Test 11: Auto-detect mode on Maize Leaf (Never leaks Tomato diseases)
  // -------------------------------------------------------------
  await runAsyncTest('Case 11: Maize leaf in auto-detect mode never returns Tomato candidates', async () => {
    const maizeAutoImg = createSyntheticImageDataUrl({
      width: 48,
      height: 96, // Elongated geometry typical of maize
      venation: 'parallel',
      symptomType: 'rust',
      baseColor: [50, 130, 45]
    });

    const result = await classifyCropLeaf({
      imageSrc: maizeAutoImg,
      selectedCrop: 'auto'
    });

    assert.strictEqual(result.detectedCrop, 'maize', 'Auto-detected crop must be maize');
    if (result.topCandidates && result.topCandidates.length > 0) {
      for (const candidate of result.topCandidates) {
        assert.strictEqual(candidate.cropId, 'maize', `Candidate ${candidate.name} must belong to maize`);
        assert.ok(!candidate.name.toLowerCase().includes('tomato'), `Candidate ${candidate.name} must not be a tomato disease`);
      }
    }
    if (result.guidance) {
      assert.strictEqual(result.guidance.cropId, 'maize');
      assert.ok(!result.guidance.disease.toLowerCase().includes('tomato'));
    }
  });

  // -------------------------------------------------------------
  // Test 12: Auto-detect mode on Tomato Leaf (Never leaks Maize diseases)
  // -------------------------------------------------------------
  await runAsyncTest('Case 12: Tomato leaf in auto-detect mode never returns Maize candidates', async () => {
    const tomatoAutoImg = createSyntheticImageDataUrl({
      width: 64,
      height: 64, // Non-elongated aspect ratio
      venation: 'reticulate',
      symptomType: 'necrotic',
      baseColor: [45, 125, 40]
    });

    const result = await classifyCropLeaf({
      imageSrc: tomatoAutoImg,
      selectedCrop: 'auto'
    });

    assert.strictEqual(result.detectedCrop, 'tomato', 'Auto-detected crop must be tomato');
    if (result.topCandidates && result.topCandidates.length > 0) {
      for (const candidate of result.topCandidates) {
        assert.strictEqual(candidate.cropId, 'tomato', `Candidate ${candidate.name} must belong to tomato`);
        assert.ok(!candidate.name.toLowerCase().includes('maize') && !candidate.name.toLowerCase().includes('corn'), `Candidate ${candidate.name} must not be a maize disease`);
      }
    }
    if (result.guidance) {
      assert.strictEqual(result.guidance.cropId, 'tomato');
      assert.ok(!result.guidance.disease.toLowerCase().includes('corn') && !result.guidance.disease.toLowerCase().includes('maize'));
    }
  });

  // -------------------------------------------------------------
  // Test 13: Auto-detect mode with ambiguous venation suppresses candidate leakage
  // -------------------------------------------------------------
  await runAsyncTest('Case 13: Auto-detect mode with ambiguous morphology suppresses candidate leakage', async () => {
    const ambiguousVenationImg = createSyntheticImageDataUrl({
      width: 64,
      height: 64,
      venation: 'none',
      symptomType: 'ambiguous',
      baseColor: [55, 125, 55]
    });

    const result = await classifyCropLeaf({
      imageSrc: ambiguousVenationImg,
      selectedCrop: 'auto'
    });

    assert.strictEqual(result.status, 'uncertain', 'Ambiguous crop must yield uncertain status');
    assert.strictEqual(result.cropDetectionStatus, 'ambiguous', 'Must flag cropDetectionStatus as ambiguous');
    assert.strictEqual(result.topCandidates, undefined, 'Must NOT return topCandidates when crop species is ambiguous');
    assert.ok(result.message.includes('Crop identification is uncertain. Select Maize (Corn), Tomato, or Potato and re-analyze the image.'));
  });

  // -------------------------------------------------------------
  // Test 14: Crop Conflict Handling (Maize selected, Tomato morphology uploaded)
  // -------------------------------------------------------------
  await runAsyncTest('Case 14: Crop conflict handling (User selected Maize, Tomato leaf uploaded)', async () => {
    const tomatoLeafImg = createSyntheticImageDataUrl({
      width: 64,
      height: 64,
      venation: 'reticulate',
      symptomType: 'necrotic',
      baseColor: [45, 125, 40]
    });

    const result = await classifyCropLeaf({
      imageSrc: tomatoLeafImg,
      selectedCrop: 'maize'
    });

    assert.strictEqual(result.status, 'uncertain');
    assert.strictEqual(result.cropDetectionStatus, 'conflict', 'Must flag crop conflict');
    assert.strictEqual(result.detectedCrop, 'tomato', 'Detected morphology should be tomato');
    assert.ok(result.cropConflictWarning, 'Must provide crop conflict warning');
    assert.strictEqual(result.topCandidates, undefined, 'Must not return candidates during crop conflict');
  });

  // -------------------------------------------------------------
  // Test 15: Crop Conflict Handling (Tomato selected, Maize morphology uploaded)
  // -------------------------------------------------------------
  await runAsyncTest('Case 15: Crop conflict handling (User selected Tomato, Maize leaf uploaded)', async () => {
    const maizeLeafImg = createSyntheticImageDataUrl({
      width: 48,
      height: 96,
      venation: 'parallel',
      symptomType: 'rust',
      baseColor: [50, 130, 45]
    });

    const result = await classifyCropLeaf({
      imageSrc: maizeLeafImg,
      selectedCrop: 'tomato'
    });

    assert.strictEqual(result.status, 'uncertain');
    assert.strictEqual(result.cropDetectionStatus, 'conflict', 'Must flag crop conflict');
    assert.strictEqual(result.detectedCrop, 'maize', 'Detected morphology should be maize');
    assert.ok(result.cropConflictWarning, 'Must provide crop conflict warning');
    assert.strictEqual(result.topCandidates, undefined, 'Must not return candidates during crop conflict');
  });

  // -------------------------------------------------------------
  // Test 16: Uncertain Maize disease scan NEVER returns Tomato partial matches
  // -------------------------------------------------------------
  await runAsyncTest('Case 16: Uncertain Maize scan strictly isolates partial matches to Maize only', async () => {
    const ambiguousMaizeImg = createSyntheticImageDataUrl({
      width: 48,
      height: 96,
      venation: 'parallel',
      symptomType: 'ambiguous',
      baseColor: [60, 115, 55]
    });

    const result = await classifyCropLeaf({
      imageSrc: ambiguousMaizeImg,
      selectedCrop: 'maize'
    });

    assert.strictEqual(result.status, 'uncertain');
    if (result.topCandidates && result.topCandidates.length > 0) {
      for (const cand of result.topCandidates) {
        assert.strictEqual(cand.cropId, 'maize', `Partial match ${cand.name} must be a maize disease`);
        assert.ok(!cand.name.toLowerCase().includes('tomato'), `Partial match ${cand.name} must NEVER be tomato`);
        assert.ok(!cand.name.toLowerCase().includes('mold'), `Partial match must not be Leaf Mold`);
        assert.ok(!cand.name.toLowerCase().includes('mosaic'), `Partial match must not be Mosaic Virus`);
        assert.ok(!cand.name.toLowerCase().includes('bacterial spot'), `Partial match must not be Tomato Bacterial Spot`);
      }
    }
  });

  // -------------------------------------------------------------
  // Test 17: Actual User Screenshot Maize Leaf in Auto-detect Mode
  // -------------------------------------------------------------
  await runAsyncTest('Case 17: Actual User Screenshot Maize Leaf in Auto-detect mode establishes Maize', async () => {
    const fixturePath = path.resolve('tests/fixtures/real-maize-leaf.txt');
    assert.ok(fs.existsSync(fixturePath), 'real-maize-leaf.txt fixture must exist');
    const realMaizeLeafImg = fs.readFileSync(fixturePath, 'utf8').trim();

    const result = await classifyCropLeaf({
      imageSrc: realMaizeLeafImg,
      selectedCrop: 'auto'
    });

    assert.strictEqual(result.detectedCrop, 'maize', 'Real maize photo must be detected as maize');
    assert.strictEqual(result.cropDetectionStatus, 'confirmed');
    assert.strictEqual(result.status, 'success', 'Confirmed maize rust disease must succeed');
    assert.strictEqual(result.guidance?.cropId, 'maize');
    assert.strictEqual(result.guidance?.diseaseId, 'maize_common_rust');
    assert.strictEqual(result.guidance?.scientificName, 'Puccinia sorghi');
    assert.ok(result.guidance?.confidence >= 0.70, 'Confidence must be high');
    assert.notStrictEqual(result.guidance?.disease, 'Tomato Late Blight');
    assert.notStrictEqual(result.guidance?.disease, 'Tomato Leaf Mold');

    // Verify candidates are strictly maize classes
    if (result.topCandidates && result.topCandidates.length > 0) {
      for (const cand of result.topCandidates) {
        assert.strictEqual(cand.cropId, 'maize');
        assert.ok(!cand.name.toLowerCase().includes('tomato'));
      }
    }
  });

  // -------------------------------------------------------------
  // Test 18: Actual User Screenshot Maize Leaf with Manually Selected Maize
  // -------------------------------------------------------------
  await runAsyncTest('Case 18: Actual User Screenshot Maize Leaf with manually selected Maize', async () => {
    const fixturePath = path.resolve('tests/fixtures/real-maize-leaf.txt');
    const realMaizeLeafImg = fs.readFileSync(fixturePath, 'utf8').trim();

    const result = await classifyCropLeaf({
      imageSrc: realMaizeLeafImg,
      selectedCrop: 'maize'
    });

    assert.strictEqual(result.status, 'success');
    assert.strictEqual(result.guidance?.cropId, 'maize');
    assert.strictEqual(result.guidance?.diseaseId, 'maize_common_rust');
    assert.ok(result.guidance?.treatment.includes('Mancozeb') || result.guidance?.treatment.includes('Azoxystrobin'));
    // Ensure no conflict was falsely raised on a real maize leaf
    assert.strictEqual(result.cropDetectionStatus, 'confirmed');
  });

  // -------------------------------------------------------------
  // Test 19: Switching from Tomato to Maize state isolation
  // -------------------------------------------------------------
  await runAsyncTest('Case 19: Switching from Tomato to Maize state isolation', async () => {
    const fixturePath = path.resolve('tests/fixtures/real-maize-leaf.txt');
    const realMaizeLeafImg = fs.readFileSync(fixturePath, 'utf8').trim();

    // Scan 1 with Tomato selected (triggers conflict on maize leaf)
    const result1 = await classifyCropLeaf({
      imageSrc: realMaizeLeafImg,
      selectedCrop: 'tomato'
    });
    assert.strictEqual(result1.cropDetectionStatus, 'conflict');
    assert.strictEqual(result1.topCandidates, undefined);

    // Scan 2 with Maize selected (switched by user)
    const result2 = await classifyCropLeaf({
      imageSrc: realMaizeLeafImg,
      selectedCrop: 'maize'
    });
    assert.strictEqual(result2.status, 'success');
    assert.strictEqual(result2.guidance?.cropId, 'maize');
    assert.strictEqual(result2.guidance?.diseaseId, 'maize_common_rust');
    // Verify no remnants of tomato conflict
    assert.strictEqual(result2.cropConflictWarning, undefined);
  });

  // -------------------------------------------------------------
  // Test 20: Uploading a new image while earlier analysis is pending (Async race condition protection)
  // -------------------------------------------------------------
  await runAsyncTest('Case 20: Async scan ID isolation prevents stale responses from overwriting newer scans', async () => {
    let activeScanId = 0;
    let latestCommittedResult = null;

    const runSimulatedScan = async (img, crop) => {
      const scanId = ++activeScanId;
      const res = await classifyCropLeaf({ imageSrc: img, selectedCrop: crop });
      if (scanId === activeScanId) {
        latestCommittedResult = res;
      }
    };

    const img1 = createSyntheticImageDataUrl({ symptomType: 'necrotic', baseColor: [45, 125, 40] });
    const img2 = createSyntheticImageDataUrl({ symptomType: 'rust', baseColor: [50, 130, 45] });

    // Launch scan 1 (Tomato), then immediately launch scan 2 (Maize)
    const p1 = runSimulatedScan(img1, 'tomato');
    const p2 = runSimulatedScan(img2, 'maize');

    await Promise.all([p1, p2]);

    assert.ok(latestCommittedResult);
    assert.strictEqual(latestCommittedResult.selectedCrop, 'maize', 'Final result must be from the newest scan');
  });

  // -------------------------------------------------------------
  // Test 21: Missing model responses, malformed inputs, and API failure robustness
  // -------------------------------------------------------------
  await runAsyncTest('Case 21: Missing model responses, malformed inputs, and API failures', async () => {
    // 21a: Malformed data URI
    const resMalformed = await classifyCropLeaf({ imageSrc: 'not_a_valid_data_uri' });
    assert.strictEqual(resMalformed.status, 'quality_error');
    assert.strictEqual(resMalformed.topCandidates, undefined);

    // 21b: Zero dimension payload
    const resZero = await classifyCropLeaf({ imageSrc: 'data:image/raw-rgba;base64;w=0;h=0,' });
    assert.strictEqual(resZero.status, 'quality_error');
    assert.strictEqual(resZero.topCandidates, undefined);

    // 21c: Non-string empty payload
    const resEmpty = await classifyCropLeaf({ imageSrc: '   ' });
    assert.strictEqual(resEmpty.status, 'error');
    assert.strictEqual(resEmpty.topCandidates, undefined);
  });

  // -------------------------------------------------------------
  // Test 22: Case 22: Soybean leaf rejection in Auto mode
  // -------------------------------------------------------------
  await runAsyncTest('Case 22: Soybean leaf in Auto-detect mode safely rejected as unsupported crop', async () => {
    const soyFixturePath = path.resolve('tests/fixtures/real-soybean-leaf.txt');
    const realSoybeanLeafImg = fs.readFileSync(soyFixturePath, 'utf8').trim();

    const result = await classifyCropLeaf({
      imageSrc: realSoybeanLeafImg,
      selectedCrop: 'auto'
    });

    assert.strictEqual(result.status, 'unsupported_crop', 'Soybean must return unsupported_crop status');
    assert.strictEqual(result.cropDetectionStatus, 'unsupported');
    assert.ok(result.message.toLowerCase().includes('soybean'), 'Message should identify soybean as detected crop');
    assert.strictEqual(result.guidance, undefined, 'Must not provide treatment guidance for soybean');
    assert.strictEqual(result.topCandidates, undefined, 'Must not return disease candidates for soybean');
    assert.notStrictEqual(result.detectedCrop, 'maize', 'Soybean must NEVER be classified as maize');
    assert.notStrictEqual(result.detectedCrop, 'tomato', 'Soybean must NEVER be classified as tomato');
  });

  // -------------------------------------------------------------
  // Test 23: Case 23: Soybean leaf with brown spots/lesions
  // -------------------------------------------------------------
  await runAsyncTest('Case 23: Spotted soybean leaf never classified as Maize Common Rust', async () => {
    const soyFixturePath = path.resolve('tests/fixtures/real-soybean-leaf.txt');
    const rawSoy = fs.readFileSync(soyFixturePath, 'utf8').trim();
    const comma = rawSoy.indexOf(',');
    const meta = rawSoy.slice(0, comma);
    const buf = Buffer.from(rawSoy.slice(comma + 1), 'base64');

    // Add brown spots (simulating foliar lesions / spots on soybean)
    for (let y = 50; y < 150; y++) {
      for (let x = 50; x < 150; x++) {
        if ((x % 5 === 0 && y % 4 === 0) || (x % 7 === 0 && y % 6 === 0)) {
          const idx = (y * 224 + x) * 4;
          buf[idx] = 160; buf[idx+1] = 80; buf[idx+2] = 40;
        }
      }
    }
    const spottedSoybeanImg = meta + ',' + buf.toString('base64');

    const result = await classifyCropLeaf({
      imageSrc: spottedSoybeanImg,
      selectedCrop: 'auto'
    });

    assert.strictEqual(result.status, 'unsupported_crop');
    assert.strictEqual(result.guidance, undefined);
    assert.notStrictEqual(result.detectedCrop, 'maize');
    assert.strictEqual(result.topCandidates, undefined);
  });

  // -------------------------------------------------------------
  // Test 24: Case 24: Soybean leaf with manually selected Maize
  // -------------------------------------------------------------
  await runAsyncTest('Case 24: Soybean leaf with user-selected Maize rejected as unsupported crop', async () => {
    const soyFixturePath = path.resolve('tests/fixtures/real-soybean-leaf.txt');
    const realSoybeanLeafImg = fs.readFileSync(soyFixturePath, 'utf8').trim();

    const result = await classifyCropLeaf({
      imageSrc: realSoybeanLeafImg,
      selectedCrop: 'maize'
    });

    assert.strictEqual(result.status, 'unsupported_crop', 'Must reject soybean even when user selected maize');
    assert.strictEqual(result.cropDetectionStatus, 'unsupported');
    assert.ok(result.message.includes('Soybean'), 'Message must explain leaf is Soybean not Maize');
    assert.strictEqual(result.guidance, undefined, 'No maize chemical treatments for soybean');
    assert.strictEqual(result.topCandidates, undefined);
  });

  // -------------------------------------------------------------
  // Test 25: Case 25: Sequential upload - Maize then Soybean completely clears diagnosis
  // -------------------------------------------------------------
  await runAsyncTest('Case 25: Sequential upload - Maize then Soybean completely clears diagnosis', async () => {
    const maizeFixturePath = path.resolve('tests/fixtures/real-maize-leaf.txt');
    const soyFixturePath = path.resolve('tests/fixtures/real-soybean-leaf.txt');
    const maizeImg = fs.readFileSync(maizeFixturePath, 'utf8').trim();
    const soyImg = fs.readFileSync(soyFixturePath, 'utf8').trim();

    // First scan: Maize leaf
    const res1 = await classifyCropLeaf({ imageSrc: maizeImg, selectedCrop: 'auto' });
    assert.strictEqual(res1.status, 'success');
    assert.strictEqual(res1.guidance?.cropId, 'maize');
    assert.strictEqual(res1.guidance?.diseaseId, 'maize_common_rust');

    // Second scan: Soybean leaf
    const res2 = await classifyCropLeaf({ imageSrc: soyImg, selectedCrop: 'auto' });
    assert.strictEqual(res2.status, 'unsupported_crop');
    assert.strictEqual(res2.guidance, undefined, 'Previous maize guidance must be gone');
    assert.strictEqual(res2.topCandidates, undefined, 'Previous maize candidates must be gone');
    assert.notStrictEqual(res2.detectedCrop, 'maize');
  });

  // -------------------------------------------------------------
  // Test 26: Case 26: Cross-crop confusion verification
  // -------------------------------------------------------------
  await runAsyncTest('Case 26: Cross-crop confusion matrix (Maize vs Tomato vs Soybean)', async () => {
    const maizeImg = fs.readFileSync(path.resolve('tests/fixtures/real-maize-leaf.txt'), 'utf8').trim();
    const tomatoImg = fs.readFileSync(path.resolve('tests/fixtures/real-tomato-leaf.txt'), 'utf8').trim();
    const soyImg = fs.readFileSync(path.resolve('tests/fixtures/real-soybean-leaf.txt'), 'utf8').trim();

    // Maize leaf with Tomato selected -> conflict
    const maizeOnTomato = await classifyCropLeaf({ imageSrc: maizeImg, selectedCrop: 'tomato' });
    assert.strictEqual(maizeOnTomato.status, 'uncertain');
    assert.strictEqual(maizeOnTomato.cropDetectionStatus, 'conflict');

    // Tomato leaf with Maize selected -> conflict
    const tomatoOnMaize = await classifyCropLeaf({ imageSrc: tomatoImg, selectedCrop: 'maize' });
    assert.strictEqual(tomatoOnMaize.status, 'uncertain');
    assert.strictEqual(tomatoOnMaize.cropDetectionStatus, 'conflict');

    // Soybean leaf with Maize selected -> unsupported_crop
    const soyOnMaize = await classifyCropLeaf({ imageSrc: soyImg, selectedCrop: 'maize' });
    assert.strictEqual(soyOnMaize.status, 'unsupported_crop');

    // Soybean leaf with Tomato selected -> unsupported_crop
    const soyOnTomato = await classifyCropLeaf({ imageSrc: soyImg, selectedCrop: 'tomato' });
    assert.strictEqual(soyOnTomato.status, 'unsupported_crop');
  });

  // -------------------------------------------------------------
  // Test 27: Explicit Potato selection with Healthy Potato leaf
  // -------------------------------------------------------------
  await runAsyncTest('Case 27: Explicit Potato selection with Healthy Potato leaf', async () => {
    const cleanPotatoImg = createSyntheticImageDataUrl({
      venation: 'reticulate',
      symptomType: 'none',
      baseColor: [35, 150, 35]
    });

    const result = await classifyCropLeaf({
      imageSrc: cleanPotatoImg,
      selectedCrop: 'potato'
    });

    assert.strictEqual(result.status, 'healthy', 'Healthy potato leaf must yield status healthy');
    assert.ok(result.guidance, 'Guidance report must exist');
    assert.strictEqual(result.guidance.cropId, 'potato');
    assert.strictEqual(result.guidance.diseaseId, 'potato_healthy');
    assert.strictEqual(result.guidance.isHealthy, true);
    assert.ok(result.guidance.treatment.includes('No disease treatment required'), 'Healthy leaf must not prescribe chemical fungicides');
    assert.ok(!result.guidance.treatment.includes('Mancozeb') && !result.guidance.treatment.includes('Metalaxyl'), 'No fungicides on healthy leaf');
    assert.ok(result.topCandidates.every(c => c.cropId === 'potato'), 'All candidates must strictly be potato');
  });

  // -------------------------------------------------------------
  // Test 28: Automatic detection suggesting Potato requires explicit Potato selection
  // -------------------------------------------------------------
  await runAsyncTest('Case 28: Auto-detect suggesting Potato requires explicit selection', async () => {
    const potatoAutoImg = createSyntheticImageDataUrl({
      venation: 'reticulate',
      symptomType: 'none',
      baseColor: [35, 150, 35]
    });

    const mockPotatoResult = {
      isModelInference: true,
      detectedCrop: 'potato',
      detectedCropSpecies: 'Potato',
      cropConfidence: 0.85,
      maizeProbMass: 0.05,
      tomatoProbMass: 0.08,
      potatoProbMass: 0.85,
      otherProbMass: 0.02,
      topPrediction: {
        classIndex: 20,
        label: 'Potato with Early Blight',
        crop: 'potato',
        diseaseId: 'potato_early_blight',
        probability: 0.85,
      },
      allPredictions: [],
      maizePredictions: [],
      tomatoPredictions: [],
      potatoPredictions: [
        { diseaseId: 'potato_early_blight', name: 'Early Blight', cropId: 'potato', probability: 0.85 }
      ]
    };

    const result = await classifyCropLeaf({
      imageSrc: potatoAutoImg,
      selectedCrop: 'auto',
      mockModelResult: mockPotatoResult
    });

    assert.strictEqual(result.status, 'uncertain');
    assert.strictEqual(result.cropDetectionStatus, 'ambiguous');
    assert.strictEqual(result.guidance, undefined, 'Must not provide guidance when auto-detection is ambiguous');
    assert.strictEqual(result.detectedCrop, 'potato');
    assert.ok(result.message.includes('Potato'));
  });

  // -------------------------------------------------------------
  // Test 29: Potato predictions strictly isolated to Potato diseases (Zero Leakage)
  // -------------------------------------------------------------
  await runAsyncTest('Case 29: Potato predictions never return Maize or Tomato disease candidates', async () => {
    const potatoImg = createSyntheticImageDataUrl({
      venation: 'reticulate',
      symptomType: 'none',
      baseColor: [35, 150, 35]
    });

    const result = await classifyCropLeaf({
      imageSrc: potatoImg,
      selectedCrop: 'potato'
    });

    assert.ok(result.topCandidates, 'Candidates must exist');
    assert.ok(result.topCandidates.length > 0);
    for (const candidate of result.topCandidates) {
      assert.strictEqual(candidate.cropId, 'potato', `Candidate ${candidate.name} must belong to potato`);
      assert.ok(!candidate.name.toLowerCase().includes('maize') && !candidate.name.toLowerCase().includes('corn'), 'Must not leak maize');
      assert.ok(!candidate.name.toLowerCase().includes('tomato'), 'Must not leak tomato');
    }
  });

  // -------------------------------------------------------------
  // Test 30: Crop conflict: User selected Potato, Maize leaf uploaded
  // -------------------------------------------------------------
  await runAsyncTest('Case 30: Crop conflict - User selected Potato, Maize leaf uploaded', async () => {
    const maizeImg = fs.readFileSync(path.resolve('tests/fixtures/real-maize-leaf.txt'), 'utf8').trim();

    const result = await classifyCropLeaf({
      imageSrc: maizeImg,
      selectedCrop: 'potato'
    });

    assert.strictEqual(result.status, 'uncertain', 'Crop conflict must result in uncertain status');
    assert.strictEqual(result.cropDetectionStatus, 'conflict', 'Must flag crop conflict');
    assert.strictEqual(result.detectedCrop, 'maize', 'Detected crop must be maize');
    assert.strictEqual(result.guidance, undefined, 'Must not return potato guidance on maize leaf');
    assert.strictEqual(result.topCandidates, undefined, 'Must not return disease candidates on conflict');
    assert.ok(result.cropConflictWarning?.includes('Maize'), 'Warning must specify Maize conflict');
  });

  // -------------------------------------------------------------
  // Test 31: Crop conflict: User selected Potato, Tomato leaf uploaded
  // -------------------------------------------------------------
  await runAsyncTest('Case 31: Crop conflict - User selected Potato, Tomato leaf uploaded', async () => {
    const tomatoImg = fs.readFileSync(path.resolve('tests/fixtures/real-tomato-leaf.txt'), 'utf8').trim();

    const result = await classifyCropLeaf({
      imageSrc: tomatoImg,
      selectedCrop: 'potato'
    });

    assert.strictEqual(result.status, 'uncertain', 'Crop conflict must result in uncertain status');
    assert.strictEqual(result.cropDetectionStatus, 'conflict', 'Must flag crop conflict');
    assert.strictEqual(result.detectedCrop, 'tomato', 'Detected crop must be tomato');
    assert.strictEqual(result.guidance, undefined, 'Must not return potato guidance on tomato leaf');
    assert.strictEqual(result.topCandidates, undefined, 'Must not return disease candidates on conflict');
    assert.ok(result.cropConflictWarning?.includes('Tomato'), 'Warning must specify Tomato conflict');
  });

  // -------------------------------------------------------------
  // Test 32: Crop conflict: User selected Maize, dicot leaf uploaded
  // -------------------------------------------------------------
  await runAsyncTest('Case 32: Crop conflict - User selected Maize, dicot leaf uploaded', async () => {
    const dicotImg = createSyntheticImageDataUrl({
      venation: 'reticulate',
      symptomType: 'necrotic',
      baseColor: [45, 125, 40]
    });

    const result = await classifyCropLeaf({
      imageSrc: dicotImg,
      selectedCrop: 'maize'
    });

    assert.strictEqual(result.status, 'uncertain');
    assert.strictEqual(result.cropDetectionStatus, 'conflict');
    assert.strictEqual(result.guidance, undefined);
    assert.strictEqual(result.topCandidates, undefined);
  });

  // -------------------------------------------------------------
  // Test 33: Unsupported crop safety: Authentic Soybean leaf uploaded with Potato selected
  // -------------------------------------------------------------
  await runAsyncTest('Case 33: Unsupported crop safety - Soybean leaf with Potato selected', async () => {
    const soyImg = fs.readFileSync(path.resolve('tests/fixtures/real-soybean-leaf.txt'), 'utf8').trim();

    const result = await classifyCropLeaf({
      imageSrc: soyImg,
      selectedCrop: 'potato'
    });

    assert.strictEqual(result.status, 'unsupported_crop', 'Must reject soybean as unsupported crop');
    assert.strictEqual(result.cropDetectionStatus, 'unsupported');
    assert.strictEqual(result.guidance, undefined, 'Must not prescribe potato fungicides for soybean');
    assert.strictEqual(result.topCandidates, undefined);
    assert.ok(result.message.includes('Soybean'), 'Message must identify soybean');
  });

  // -------------------------------------------------------------
  // Test 34: Low-confidence Potato scan returns uncertainty
  // -------------------------------------------------------------
  await runAsyncTest('Case 34: Low-confidence Potato scan safely returns uncertainty', async () => {
    const ambiguousImg = createSyntheticImageDataUrl({
      venation: 'reticulate',
      symptomType: 'ambiguous',
      baseColor: [35, 150, 35]
    });

    const result = await classifyCropLeaf({
      imageSrc: ambiguousImg,
      selectedCrop: 'potato'
    });

    assert.strictEqual(result.status, 'uncertain', 'Low confidence scan must return uncertain');
    assert.strictEqual(result.guidance, undefined, 'Never prescribe fungicides for uncertain scan');
  });

  // -------------------------------------------------------------
  // Test 35: Sequential scan state isolation (Maize -> Potato -> Soybean)
  // -------------------------------------------------------------
  await runAsyncTest('Case 35: Sequential scan state isolation (Maize -> Potato -> Soybean)', async () => {
    const maizeImg = fs.readFileSync(path.resolve('tests/fixtures/real-maize-leaf.txt'), 'utf8').trim();
    const cleanPotatoImg = createSyntheticImageDataUrl({
      venation: 'reticulate',
      symptomType: 'none',
      baseColor: [35, 150, 35]
    });
    const soyImg = fs.readFileSync(path.resolve('tests/fixtures/real-soybean-leaf.txt'), 'utf8').trim();

    // Step 1: Maize leaf
    const res1 = await classifyCropLeaf({ imageSrc: maizeImg, selectedCrop: 'maize' });
    assert.strictEqual(res1.status, 'success');
    assert.strictEqual(res1.guidance?.cropId, 'maize');

    // Step 2: Clean Potato leaf
    const res2 = await classifyCropLeaf({ imageSrc: cleanPotatoImg, selectedCrop: 'potato' });
    assert.strictEqual(res2.status, 'healthy');
    assert.strictEqual(res2.guidance?.cropId, 'potato');
    assert.ok(res2.guidance?.treatment.includes('No disease treatment required'));

    // Step 3: Soybean leaf
    const res3 = await classifyCropLeaf({ imageSrc: soyImg, selectedCrop: 'potato' });
    assert.strictEqual(res3.status, 'unsupported_crop');
    assert.strictEqual(res3.guidance, undefined);
    assert.strictEqual(res3.topCandidates, undefined);
  });

  // -------------------------------------------------------------
  // Test 36: ICAR-CPRI Authoritative Treatment & Advisory Verification for Potato
  // -------------------------------------------------------------
  await runAsyncTest('Case 36: ICAR-CPRI Authoritative Treatment & Advisory Verification for Potato', async () => {
    const earlyBlight = CROP_DISEASE_KNOWLEDGE_BASE['potato_early_blight'];
    const lateBlight = CROP_DISEASE_KNOWLEDGE_BASE['potato_late_blight'];
    const healthyPotato = CROP_DISEASE_KNOWLEDGE_BASE['potato_healthy'];

    assert.ok(earlyBlight, 'Early blight knowledge entry must exist');
    assert.strictEqual(earlyBlight.cropId, 'potato');
    assert.ok(earlyBlight.treatment.includes('Mancozeb') || earlyBlight.treatment.includes('Chlorothalonil'));
    assert.ok(earlyBlight.referenceSource.includes('Central Potato Research Institute (CPRI)'));

    assert.ok(lateBlight, 'Late blight knowledge entry must exist');
    assert.strictEqual(lateBlight.cropId, 'potato');
    assert.ok(lateBlight.treatment.includes('Metalaxyl') || lateBlight.treatment.includes('Cymoxanil'));
    assert.ok(lateBlight.referenceSource.includes('Central Potato Research Institute (CPRI)'));

    assert.ok(healthyPotato, 'Healthy potato knowledge entry must exist');
    assert.strictEqual(healthyPotato.cropId, 'potato');
    assert.strictEqual(healthyPotato.isHealthy, true);
    assert.ok(healthyPotato.treatment.includes('No disease treatment required'));
  });

  // -------------------------------------------------------------
  // Test 37: Explicit Potato selection with Potato Early Blight diagnosis
  // -------------------------------------------------------------
  await runAsyncTest('Case 37: Explicit Potato selection with Early Blight diagnosis', async () => {
    const potatoEarlyBlightImg = createSyntheticImageDataUrl({
      venation: 'reticulate',
      symptomType: 'necrotic',
      baseColor: [45, 125, 40]
    });

    const mockEarlyBlightResult = {
      isModelInference: true,
      detectedCrop: 'potato',
      detectedCropSpecies: 'Potato',
      cropConfidence: 0.88,
      maizeProbMass: 0.04,
      tomatoProbMass: 0.06,
      potatoProbMass: 0.88,
      otherProbMass: 0.02,
      topPrediction: {
        classIndex: 20,
        label: 'Potato with Early Blight',
        crop: 'potato',
        diseaseId: 'potato_early_blight',
        probability: 0.85,
      },
      allPredictions: [],
      maizePredictions: [],
      tomatoPredictions: [],
      potatoPredictions: [
        { diseaseId: 'potato_early_blight', name: 'Early Blight', cropId: 'potato', probability: 0.85 },
        { diseaseId: 'potato_late_blight', name: 'Late Blight', cropId: 'potato', probability: 0.10 },
        { diseaseId: 'potato_healthy', name: 'Healthy Potato', cropId: 'potato', probability: 0.05 },
      ],
    };

    const result = await classifyCropLeaf({
      imageSrc: potatoEarlyBlightImg,
      selectedCrop: 'potato',
      mockModelResult: mockEarlyBlightResult,
    });

    assert.strictEqual(result.status, 'success');
    assert.ok(result.guidance);
    assert.strictEqual(result.guidance.cropId, 'potato');
    assert.strictEqual(result.guidance.diseaseId, 'potato_early_blight');
    assert.strictEqual(result.guidance.scientificName, 'Alternaria solani');
    assert.ok(result.guidance.treatment.includes('Mancozeb') || result.guidance.treatment.includes('Chlorothalonil'));
    assert.notStrictEqual(result.guidance.cropId, 'maize');
    assert.notStrictEqual(result.guidance.cropId, 'tomato');
  });

  // -------------------------------------------------------------
  // Test 38: Explicit Potato selection with Potato Late Blight diagnosis
  // -------------------------------------------------------------
  await runAsyncTest('Case 38: Explicit Potato selection with Late Blight diagnosis', async () => {
    const potatoLateBlightImg = createSyntheticImageDataUrl({
      venation: 'reticulate',
      symptomType: 'necrotic',
      baseColor: [45, 125, 40]
    });

    const mockLateBlightResult = {
      isModelInference: true,
      detectedCrop: 'potato',
      detectedCropSpecies: 'Potato',
      cropConfidence: 0.89,
      maizeProbMass: 0.03,
      tomatoProbMass: 0.05,
      potatoProbMass: 0.89,
      otherProbMass: 0.03,
      topPrediction: {
        classIndex: 21,
        label: 'Potato with Late Blight',
        crop: 'potato',
        diseaseId: 'potato_late_blight',
        probability: 0.86,
      },
      allPredictions: [],
      maizePredictions: [],
      tomatoPredictions: [],
      potatoPredictions: [
        { diseaseId: 'potato_late_blight', name: 'Late Blight', cropId: 'potato', probability: 0.86 },
        { diseaseId: 'potato_early_blight', name: 'Early Blight', cropId: 'potato', probability: 0.09 },
        { diseaseId: 'potato_healthy', name: 'Healthy Potato', cropId: 'potato', probability: 0.05 },
      ],
    };

    const result = await classifyCropLeaf({
      imageSrc: potatoLateBlightImg,
      selectedCrop: 'potato',
      mockModelResult: mockLateBlightResult,
    });

    assert.strictEqual(result.status, 'success');
    assert.ok(result.guidance);
    assert.strictEqual(result.guidance.cropId, 'potato');
    assert.strictEqual(result.guidance.diseaseId, 'potato_late_blight');
    assert.strictEqual(result.guidance.scientificName, 'Phytophthora infestans');
    assert.ok(result.guidance.treatment.includes('Metalaxyl') || result.guidance.treatment.includes('Cymoxanil') || result.guidance.treatment.includes('Mancozeb'));
    assert.notStrictEqual(result.guidance.cropId, 'maize');
    assert.notStrictEqual(result.guidance.cropId, 'tomato');
  });

  console.log(`\n========================================`);
  console.log(`Test Results: ${passedTests}/${totalTests} tests passed.`);
  console.log(`========================================\n`);

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unhandled test runner error:', err);
  process.exit(1);
});
