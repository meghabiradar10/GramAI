
/**
 * Vetted Agricultural Extension Knowledge Base
 * Crop guidance for Maize, Tomato, and Potato.
 */

import {
  AgriculturalGuidance,
  DiseaseId,
  SupportedCrop
} from './types';

type GuidanceEntry = Omit<
  AgriculturalGuidance,
  'confidence' | 'confidencePercent' | 'confidenceLevel'
>;

export const CROP_DISEASE_KNOWLEDGE_BASE: Record<DiseaseId, GuidanceEntry> = {
  // ==========================================
  // MAIZE (CORN) CONDITIONS
  // ==========================================
  maize_common_rust: {
    crop: 'Maize (Corn)',
    cropId: 'maize',
    disease: 'Common Rust',
    diseaseId: 'maize_common_rust',
    scientificName: 'Puccinia sorghi',
    isHealthy: false,
    symptoms: [
      'Small reddish-brown powdery pustules on leaves',
      'Pustules may appear on both leaf surfaces',
      'Severe infection can cause leaf yellowing and premature death'
    ],
    cause: 'Fungal disease caused by Puccinia sorghi, favored by cool to moderate temperatures and high humidity.',
    severity: 'High',
    treatment: 'Apply foliar spray of Mancozeb 75% WP @ 2.0–2.5 g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L if pustules appear on upper leaves before tasseling. Verify with local KVK and follow label directions and pre-harvest intervals.',
    organicTreatment: 'Use locally recommended biological control options and remove heavily infected debris where appropriate.',
    prevention: 'Grow resistant hybrids, maintain recommended plant spacing, and balance crop nutrition.',
    referenceSource: 'ICAR - Indian Institute of Maize Research (IIMR); confirm local recommendations with a KVK.',
    advisoryNote: 'Verify symptoms before applying fungicides and follow label directions and pre-harvest intervals.'
  },

  maize_northern_leaf_blight: {
    crop: 'Maize (Corn)',
    cropId: 'maize',
    disease: 'Northern Corn Leaf Blight (NCLB)',
    diseaseId: 'maize_northern_leaf_blight',
    scientificName: 'Exserohilum turcicum',
    isHealthy: false,
    symptoms: [
      'Long, elliptical, cigar-shaped gray-green or tan lesions',
      'Lesions extend along leaf veins',
      'Severe infection can cause extensive leaf blighting'
    ],
    cause: 'Fungal disease caused by Exserohilum turcicum, favored by moderate temperatures and extended leaf wetness.',
    severity: 'High',
    treatment: 'Consult a local agricultural officer about locally registered disease-control options.',
    organicTreatment: 'Remove severely infected debris where appropriate and use locally recommended biological products.',
    prevention: 'Rotate crops, manage crop residue, and select tolerant maize hybrids.',
    referenceSource: 'ICAR maize research and agricultural extension guidance.',
    advisoryNote: 'Confirm the diagnosis and follow local pesticide recommendations.'
  },

  maize_gray_leaf_spot: {
    crop: 'Maize (Corn)',
    cropId: 'maize',
    disease: 'Gray Leaf Spot',
    diseaseId: 'maize_gray_leaf_spot',
    scientificName: 'Cercospora zeae-maydis',
    isHealthy: false,
    symptoms: [
      'Tan spots that develop into narrow rectangular lesions',
      'Lesion edges are limited by parallel leaf veins',
      'Severe blighting may reduce plant vigor and yield'
    ],
    cause: 'Fungal disease caused by Cercospora species, favored by warm, humid conditions.',
    severity: 'Moderate',
    treatment: 'Seek local agricultural advice on suitable registered treatments after confirming the disease.',
    organicTreatment: 'Manage infected crop residue and seek advice about appropriate biological control products.',
    prevention: 'Rotate crops, manage crop residue, and avoid excessively dense planting.',
    referenceSource: 'ICAR agricultural extension guidance.',
    advisoryNote: 'Use only locally approved products and label directions.'
  },

  maize_healthy: {
    crop: 'Maize (Corn)',
    cropId: 'maize',
    disease: 'Healthy Maize Leaf',
    diseaseId: 'maize_healthy',
    scientificName: 'Zea mays',
    isHealthy: true,
    symptoms: [
      'Generally uniform green leaf blades',
      'Distinct parallel venation',
      'No obvious characteristic disease lesions or rust pustules'
    ],
    cause: 'No characteristic disease symptoms identified in the inspected image.',
    severity: 'None',
    treatment: 'No disease treatment required. Continue regular crop monitoring and follow recommended nutrient and water management.',
    organicTreatment: 'Maintain soil organic matter and follow locally recommended nutrient management.',
    prevention: 'Inspect plants regularly and maintain appropriate field drainage.',
    referenceSource: 'ICAR and State Agricultural University extension guidance.',
    advisoryNote: 'Continue regular monitoring; this result does not rule out early infection or insect damage.'
  },

  // ==========================================
  // TOMATO CONDITIONS
  // ==========================================
  tomato_late_blight: {
    crop: 'Tomato',
    cropId: 'tomato',
    disease: 'Tomato Late Blight',
    diseaseId: 'tomato_late_blight',
    scientificName: 'Phytophthora infestans',
    isHealthy: false,
    symptoms: [
      'Irregular, water-soaked dark lesions on leaves',
      'White growth may appear beneath lesions in humid conditions',
      'Lesions can spread rapidly to stems and fruit'
    ],
    cause: 'Disease caused by Phytophthora infestans, favored by cool, humid weather and prolonged leaf wetness.',
    severity: 'Severe',
    treatment: 'Apply foliar spray of Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2.5 g/L or Cymoxanil 8% + Mancozeb 64% WP @ 3.0 g/L at the first appearance of late blight lesions. Follow pre-harvest intervals and statutory spray limits.',
    organicTreatment: 'Remove and dispose of infected plant material according to local agricultural guidance.',
    prevention: 'Avoid prolonged leaf wetness, improve drainage, and inspect crops frequently in cool, wet weather.',
    referenceSource: 'ICAR vegetable research and agricultural extension guidance.',
    advisoryNote: 'Late blight can spread quickly. Obtain expert confirmation promptly.'
  },

  tomato_early_blight: {
    crop: 'Tomato',
    cropId: 'tomato',
    disease: 'Tomato Early Blight',
    diseaseId: 'tomato_early_blight',
    scientificName: 'Alternaria solani',
    isHealthy: false,
    symptoms: [
      'Brown circular spots with concentric rings',
      'Yellowing around lesions',
      'Older leaves may yellow, dry, and drop'
    ],
    cause: 'Fungal disease caused by Alternaria solani, favored by warm conditions and leaf wetness.',
    severity: 'Moderate',
    treatment: 'Confirm the disease and consult a local agricultural expert about registered treatments.',
    organicTreatment: 'Remove infected debris and use locally recommended biological products where suitable.',
    prevention: 'Rotate crops, avoid overhead watering where practical, and improve airflow.',
    referenceSource: 'ICAR and agricultural university extension guidance.',
    advisoryNote: 'Other leaf diseases may resemble early blight. Confirm before treatment.'
  },

  tomato_bacterial_spot: {
    crop: 'Tomato',
    cropId: 'tomato',
    disease: 'Tomato Bacterial Spot',
    diseaseId: 'tomato_bacterial_spot',
    scientificName: 'Xanthomonas species',
    isHealthy: false,
    symptoms: [
      'Small dark or water-soaked leaf spots',
      'Spots may develop yellow halos',
      'Raised or scabby lesions may occur on fruit'
    ],
    cause: 'Bacterial disease that can spread through splashing water, contaminated tools, and infected planting material.',
    severity: 'Moderate',
    treatment: 'Consult a local agricultural expert about appropriate locally registered management options.',
    organicTreatment: 'Use clean planting material and practice field sanitation.',
    prevention: 'Avoid handling wet plants, disinfect tools, and use disease-free seed.',
    referenceSource: 'State Agricultural University and ICAR extension guidance.',
    advisoryNote: 'Use bactericides only where locally approved and according to label directions.'
  },

  tomato_septoria_leaf_spot: {
    crop: 'Tomato',
    cropId: 'tomato',
    disease: 'Septoria Leaf Spot',
    diseaseId: 'tomato_septoria_leaf_spot',
    scientificName: 'Septoria lycopersici',
    isHealthy: false,
    symptoms: [
      'Small circular spots with dark margins and pale centers',
      'Tiny dark specks may appear within lesions',
      'Infection often starts on lower leaves'
    ],
    cause: 'Fungal disease favored by warm, wet conditions and infected crop residue.',
    severity: 'Moderate',
    treatment: 'Seek local agricultural advice about registered treatments after confirming the disease.',
    organicTreatment: 'Remove infected debris and maintain good airflow around plants.',
    prevention: 'Rotate crops, manage weeds, and avoid prolonged leaf wetness.',
    referenceSource: 'Agricultural university plant pathology extension guidance.',
    advisoryNote: 'Confirm the diagnosis before using any pesticide.'
  },

  tomato_leaf_mold: {
    crop: 'Tomato',
    cropId: 'tomato',
    disease: 'Tomato Leaf Mold',
    diseaseId: 'tomato_leaf_mold',
    scientificName: 'Passalora fulva',
    isHealthy: false,
    symptoms: [
      'Pale green or yellow patches on upper leaf surfaces',
      'Olive-green or gray mold may develop on leaf undersides',
      'Affected leaves may curl, yellow, and drop'
    ],
    cause: 'Fungal disease commonly favored by high humidity and dense foliage.',
    severity: 'Moderate',
    treatment: 'Confirm the disease and seek local advice on registered treatments.',
    organicTreatment: 'Improve ventilation and remove heavily infected plant debris where appropriate.',
    prevention: 'Improve airflow, avoid prolonged leaf wetness, and monitor dense canopies.',
    referenceSource: 'ICAR and agricultural university extension guidance.',
    advisoryNote: 'Check the undersides of leaves and confirm the diagnosis before treatment.'
  },

  tomato_yellow_leaf_curl_virus: {
    crop: 'Tomato',
    cropId: 'tomato',
    disease: 'Tomato Yellow Leaf Curl Virus',
    diseaseId: 'tomato_yellow_leaf_curl_virus',
    scientificName: 'Begomovirus group',
    isHealthy: false,
    symptoms: [
      'Upward curling and cupping of leaves',
      'Yellowing along leaf margins',
      'Reduced leaf size and stunted growth'
    ],
    cause: 'Viral disease transmitted by whiteflies.',
    severity: 'Severe',
    treatment: 'There is no curative treatment for an infected plant. Seek local agricultural advice on removing infected plants and managing whiteflies.',
    organicTreatment: 'Use monitoring traps and locally recommended non-chemical whitefly management.',
    prevention: 'Use healthy seedlings, monitor whiteflies, and select locally recommended resistant varieties where available.',
    referenceSource: 'ICAR and agricultural university extension guidance.',
    advisoryNote: 'Manage the whitefly vector and confirm the diagnosis with an agricultural expert.'
  },

  tomato_mosaic_virus: {
    crop: 'Tomato',
    cropId: 'tomato',
    disease: 'Tomato Mosaic Virus',
    diseaseId: 'tomato_mosaic_virus',
    scientificName: 'Tobamovirus group',
    isHealthy: false,
    symptoms: [
      'Mottled light and dark green leaf patterns',
      'Leaf distortion, blistering, or puckering',
      'Plant growth may be reduced'
    ],
    cause: 'Viral disease that can spread through infected seed, contaminated tools, and handling.',
    severity: 'High',
    treatment: 'There is no curative chemical treatment. Seek local agricultural advice on managing infected plants.',
    organicTreatment: 'Practice sanitation and use clean planting material.',
    prevention: 'Clean tools, wash hands before handling plants, and use certified healthy seed.',
    referenceSource: 'ICAR plant pathology extension guidance.',
    advisoryNote: 'Avoid spreading sap from infected plants to healthy plants.'
  },

  tomato_healthy: {
    crop: 'Tomato',
    cropId: 'tomato',
    disease: 'Healthy Tomato Leaf',
    diseaseId: 'tomato_healthy',
    scientificName: 'Solanum lycopersicum',
    isHealthy: true,
    symptoms: [
      'Generally green leaflets',
      'No obvious characteristic disease lesions or mosaic patterns',
      'Foliage appears reasonably intact'
    ],
    cause: 'No characteristic disease symptoms identified in the inspected image.',
    severity: 'None',
    treatment: 'No disease-specific treatment is indicated by this result.',
    organicTreatment: 'Maintain soil health and use appropriate crop nutrition.',
    prevention: 'Inspect leaves regularly for early signs of disease and pests.',
    referenceSource: 'ICAR and agricultural university extension guidance.',
    advisoryNote: 'A healthy prediction does not rule out early infection, pests, or nutrient deficiencies.'
  },

  // ==========================================
  // POTATO CONDITIONS
  // ==========================================
  potato_early_blight: {
    crop: 'Potato',
    cropId: 'potato',
    disease: 'Potato Early Blight',
    diseaseId: 'potato_early_blight',
    scientificName: 'Alternaria solani',
    isHealthy: false,
    symptoms: [
      'Brown circular leaf spots with concentric rings',
      'Yellowing around lesions',
      'Older leaves may dry and die'
    ],
    cause: 'Fungal disease caused by Alternaria solani.',
    severity: 'Moderate',
    treatment: 'Apply foliar spray of Mancozeb 75% WP @ 2.0–2.5 kg/ha (2.0–2.5 g/L) or Chlorothalonil 75% WP @ 2.0 g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L at initial disease onset. Ensure thorough foliage coverage and observe statutory pre-harvest intervals.',
    organicTreatment: 'Apply foliar spray of bio-control agent Trichoderma viride 1% WP @ 5–10 g/L; rogue and destroy infected lower foliage.',
    prevention: 'Use certified disease-free seed tubers, practice 2-to-3 year crop rotation with non-solanaceous crops, avoid overhead sprinkler irrigation, and maintain balanced soil fertility.',
    referenceSource: 'ICAR - Central Potato Research Institute (CPRI), Shimla; CIBRC Fungicide Compendium.',
    advisoryNote: 'Confirm diagnosis before applying chemical sprays. Strictly adhere to registered product label dosages, safe handling procedures, and local extension guidance.'
  },

  potato_late_blight: {
    crop: 'Potato',
    cropId: 'potato',
    disease: 'Potato Late Blight',
    diseaseId: 'potato_late_blight',
    scientificName: 'Phytophthora infestans',
    isHealthy: false,
    symptoms: [
      'Irregular dark, water-soaked leaf lesions',
      'White growth may appear beneath lesions in humid weather',
      'Lesions can spread rapidly through leaves and stems',
      'Tubers may develop reddish-brown internal discoloration'
    ],
    cause: 'A destructive oomycete disease favored by cool, humid weather.',
    severity: 'Severe',
    treatment: 'Prophylactic: Spray Mancozeb 75% WP @ 2.5 g/L or Copper Oxychloride 50% WP @ 3.0 g/L prior to disease appearance during cloudy/humid spells. Curative (at first lesion appearance): Spray Cymoxanil 8% + Mancozeb 64% WP @ 3.0 g/L or Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2.5 g/L. Strictly limit systemic fungicides to maximum 2 sprays per season to avoid pathogen resistance.',
    organicTreatment: 'Apply 1% Bordeaux mixture (Copper sulphate + lime) and ensure high soil hilling (earthing-up 10–12 cm) to prevent sporangia from washing into developing tubers.',
    prevention: 'Plant certified blight-resistant varieties (e.g., Kufri Girdhari, Kufri Himalini), utilize ICAR-CPRI Indo-Blightcast advisory alerts, ensure good field drainage, and destroy cull piles.',
    referenceSource: 'ICAR - Central Potato Research Institute (CPRI), Shimla Technical Bulletins; CIBRC Registered Fungicides.',
    advisoryNote: 'Late blight spreads explosively under cool, wet conditions (10–20°C, RH > 80%). Prompt preventive application is critical. Confirm with your nearest Krishi Vigyan Kendra (KVK).'
  },

  potato_healthy: {
    crop: 'Potato',
    cropId: 'potato',
    disease: 'Healthy Potato Leaf',
    diseaseId: 'potato_healthy',
    scientificName: 'Solanum tuberosum',
    isHealthy: true,
    symptoms: [
      'Green leaflets without obvious disease lesions',
      'No clear spreading water-soaked patches or characteristic spots',
      'Leaves appear reasonably intact'
    ],
    cause: 'No characteristic disease symptoms identified in the inspected image.',
    severity: 'None',
    treatment: 'No disease treatment required. Continue regular crop monitoring and maintain recommended nutrient and water management.',
    organicTreatment: 'Maintain soil health, apply well-decomposed FYM, and use healthy certified seed tubers.',
    prevention: 'Inspect plants regularly, perform proper earthing-up, and maintain suitable field drainage.',
    referenceSource: 'ICAR - Central Potato Research Institute (CPRI), Shimla Guidelines.',
    advisoryNote: 'A healthy prediction does not rule out early infection, pests, or nutrient deficiencies.'
  }
};

/**
 * Returns list of supported diseases for a given crop species.
 */
export function getSupportedDiseasesForCrop(crop: SupportedCrop): DiseaseId[] {
  if (crop === 'maize') {
    return [
      'maize_common_rust',
      'maize_northern_leaf_blight',
      'maize_gray_leaf_spot',
      'maize_healthy'
    ];
  }

  if (crop === 'tomato') {
    return [
      'tomato_late_blight',
      'tomato_early_blight',
      'tomato_bacterial_spot',
      'tomato_septoria_leaf_spot',
      'tomato_leaf_mold',
      'tomato_yellow_leaf_curl_virus',
      'tomato_mosaic_virus',
      'tomato_healthy'
    ];
  }

  if (crop === 'potato') {
    return [
      'potato_early_blight',
      'potato_late_blight',
      'potato_healthy'
    ];
  }

  return [];
}
