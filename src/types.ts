/**
 * ParkinSense Biomarker Types & Interfaces
 */

export type HardwareStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
export type RecordingState = 'inactive' | 'recording' | 'paused' | 'stopped';
export type AnalysisStatus = 'idle' | 'pending' | 'processing' | 'completed' | 'awaiting' | 'failed';

export interface AcousticFeatures44 {
  // Pitch & Fundamental Frequency (5)
  f0_mean: number;
  f0_std: number;
  f0_min: number;
  f0_max: number;
  f0_range: number;

  // Jitter Variations (5)
  jitter_local_pct: number;
  jitter_abs_us: number;
  jitter_rap: number;
  jitter_ppq5: number;
  jitter_ddp: number;

  // Shimmer Variations (6)
  shimmer_local_pct: number;
  shimmer_db: number;
  shimmer_apq3: number;
  shimmer_apq5: number;
  shimmer_apq11: number;
  shimmer_dda: number;

  // Harmonicity & Noise (2)
  hnr_db: number;
  nhr_ratio: number;

  // Nonlinear Dynamic Measures (6)
  rpde: number;
  dfa: number;
  ppe: number;
  spread1: number;
  spread2: number;
  d2_correlation: number;

  // Mel-Frequency Cepstral Coefficients MFCC 1-13 (13)
  mfcc_1: number;
  mfcc_2: number;
  mfcc_3: number;
  mfcc_4: number;
  mfcc_5: number;
  mfcc_6: number;
  mfcc_7: number;
  mfcc_8: number;
  mfcc_9: number;
  mfcc_10: number;
  mfcc_11: number;
  mfcc_12: number;
  mfcc_13: number;

  // Spectral & Formant Dynamics (7)
  spectral_centroid_hz: number;
  spectral_rolloff_hz: number;
  spectral_flux: number;
  zero_crossing_rate: number;
  formant_f1_hz: number;
  formant_f2_hz: number;
  formant_f3_hz: number;
}

export interface ModelPrediction {
  modelName: string;
  modelVersion: string;
  trainingCorpus: string;
  inferenceEngine: string;
  pdPatternProbabilityPct: number;
  nonPdPatternProbabilityPct: number;
  confidenceScorePct: number;
  decisionMargin: number;
  detectedCharacteristics: string[];
  keyExtractedFeatures: {
    name: string;
    value: string | number;
    reference: string;
    status: 'nominal' | 'elevated' | 'reduced' | 'atypical';
    impact: 'low' | 'moderate' | 'high';
  }[];
  explanation: string;
  scientificNotes: string;
}

export interface SpeechAnalysisResult {
  success: boolean;
  status: string;
  message: string;
  timestamp: number;
  meta: {
    durationSeconds: number;
    sampleRate: number;
    audioSizeBytes: number;
    channels: number;
    featuresExtractedCount: number;
    preprocessingApplied: string[];
  };
  extractedFeatures: AcousticFeatures44;
  prediction: ModelPrediction;
  disclaimer: string;
}

export interface PoseLandmarkPoint {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface FramePoseData {
  timestamp: number;
  landmarks: PoseLandmarkPoint[];
  leftElbowAngleDeg: number;
  rightElbowAngleDeg: number;
  leftKneeAngleDeg: number;
  rightKneeAngleDeg: number;
  trunkInclinationDeg: number;
}

export interface KinematicMeasurements {
  summary: {
    recordedDuration: number;
    processedFrames: number;
    averageFps: number;
  };
  jointTrajectories: {
    leftArmSwingRangeDeg: number;
    rightArmSwingRangeDeg: number;
    trunkFlexionAngleDeg: number;
    kneeFlexionRangeDeg: number;
  };
  symmetry: {
    armSwingAsymmetryPct: number;
    bilateralKneeSymmetryIndex: number;
    stepLengthSymmetryPct: number;
  };
  gaitTiming: {
    cadenceStepsPerMin: number;
    stepFrequencyHz: number;
    strideTimeConsistencyCv: number;
  };
  movementSmoothness: {
    normalizedJerkMetric: number;
    spectralArcLength: number;
    rating: string;
  };
  sensorDistinction: {
    reliablyEstimatedFromVideo: string[];
    requiringAdditionalSensors: string[];
    notes: string;
  };
}

export interface MovementAnalysisResult {
  success: boolean;
  status: string;
  message: string;
  notice: string;
  timestamp: number;
  movementMeasurements: KinematicMeasurements;
  prediction: ModelPrediction;
  disclaimer: string;
}

export interface SessionAssessmentItem {
  id: string;
  type: 'speech' | 'movement';
  timestamp: number;
  title: string;
  modelName: string;
  pdProbabilityPct: number;
  nonPdProbabilityPct: number;
  confidencePct: number;
  summary: string;
}
