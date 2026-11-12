import React, { useState } from 'react';
import {
  SpeechAnalysisResult,
  MovementAnalysisResult,
  SessionAssessmentItem,
} from '../types';
import {
  Activity,
  Mic,
  Camera,
  Layers,
  ShieldCheck,
  Info,
  Clock,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Download,
  AlertTriangle,
  HelpCircle,
  BarChart2,
  CheckCircle2,
} from 'lucide-react';

interface ResultsDashboardProps {
  speechResult: SpeechAnalysisResult | null;
  movementResult: MovementAnalysisResult | null;
  sessionHistory: SessionAssessmentItem[];
  onNavigateToTab: (tab: string) => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  speechResult,
  movementResult,
  sessionHistory,
  onNavigateToTab,
}) => {
  const [activeTab, setActiveTab] = useState<'combined' | 'speech' | 'movement' | 'history'>('combined');

  const hasBoth = speechResult !== null && movementResult !== null;
  const hasEither = speechResult !== null || movementResult !== null;

  // Circular gauge SVG helper
  const renderCircularGauge = (
    pct: number,
    label: string,
    subLabel: string,
    color: 'sky' | 'emerald' | 'amber'
  ) => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (pct / 100) * circumference;

    const strokeColors = {
      sky: '#38bdf8',
      emerald: '#34d399',
      amber: '#fbbf24',
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-xl border border-slate-800">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background track */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="rgba(51, 65, 85, 0.4)"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated progress track */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke={strokeColors[color]}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Central numeric display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums tracking-tight">
              {pct}%
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
              PROBABILITY
            </span>
          </div>
        </div>

        <div className="text-center mt-3">
          <p className="text-xs font-semibold text-slate-200">{label}</p>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{subLabel}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Assessment Mode Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">
            <span>Machine Learning Telemetry</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Multimodal Pattern Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            AI Analysis Results & Biometric Telemetry
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Quantitative assessment of speech acoustic micro-perturbations and computer vision kinematic gait coordination against validated research cohorts.
          </p>
        </div>

        {/* Tab Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('combined')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'combined'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Combined Analysis
          </button>
          <button
            onClick={() => setActiveTab('speech')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'speech'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Speech Results
          </button>
          <button
            onClick={() => setActiveTab('movement')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'movement'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Movement Results
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Session Log ({sessionHistory.length})
          </button>
        </div>
      </div>

      {/* Mandatory Permanent Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Permanent Research Notice:</strong> ParkinSense is an experimental AI-based research prototype designed to analyze speech and movement patterns associated with Parkinson's disease. It is not a medical diagnostic tool. Its results do not confirm or exclude Parkinson's disease. Consult a qualified healthcare professional for medical assessment.
        </p>
      </div>

      {/* COMBINED ANALYSIS TAB */}
      {activeTab === 'combined' && (
        <div className="space-y-8">
          {/* Missing Assessment Alert if only one or none completed */}
          {!hasBoth && (
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sky-400 text-sm font-semibold">
                  <Info className="w-4 h-4" />
                  <span>
                    {!hasEither
                      ? 'No Completed Assessments Yet'
                      : !speechResult
                      ? 'Speech Trial Pending Completion'
                      : 'Movement Trial Pending Completion'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">
                  To view side-by-side comparative telemetry, complete both the Speech Phonation recording and the Camera Movement assessment.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {!speechResult && (
                  <button
                    onClick={() => onNavigateToTab('speech')}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Run Speech Trial</span>
                  </button>
                )}
                {!movementResult && (
                  <button
                    onClick={() => onNavigateToTab('movement')}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Run Movement Trial</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Dual Score Cards & Probability Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Speech Analysis Score Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/80 flex items-center justify-center text-sky-400">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Speech Acoustic Findings</h3>
                    <p className="text-[11px] text-slate-400 font-mono">44 PHONATION PARAMETERS</p>
                  </div>
                </div>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400">
                  {speechResult ? 'EVALUATED' : 'NOT TESTED'}
                </span>
              </div>

              {speechResult ? (
                <div className="space-y-6">
                  {/* Circular Indicators */}
                  <div className="grid grid-cols-2 gap-4">
                    {renderCircularGauge(
                      speechResult.prediction.pdPatternProbabilityPct,
                      "Parkinson's-Related Speech Patterns",
                      'Dysphonia Alignment',
                      'sky'
                    )}
                    {renderCircularGauge(
                      speechResult.prediction.nonPdPatternProbabilityPct,
                      'Non-Parkinsonian Patterns',
                      'Phonatory Stability',
                      'emerald'
                    )}
                  </div>

                  {/* Model Confidence Metric (Clearly distinguished from probability) */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block font-mono text-[10px]">MODEL CONFIDENCE SCORE</span>
                      <span className="text-slate-200 font-semibold">
                        Boundary Distance Margin
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold font-mono text-sky-300 tabular-nums">
                        {speechResult.prediction.confidenceScorePct}%
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        (Decision Margin: {speechResult.prediction.decisionMargin})
                      </span>
                    </div>
                  </div>

                  {/* Detected Speech Characteristics */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                      Detected Acoustic Characteristics:
                    </p>
                    <ul className="space-y-1 text-xs text-slate-300 font-mono">
                      {speechResult.prediction.detectedCharacteristics.map((char, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Model Identification */}
                  <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <p className="text-slate-300 font-sans font-semibold">Model Identification:</p>
                    <p>· {speechResult.prediction.modelName}</p>
                    <p>· Training: {speechResult.prediction.trainingCorpus}</p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-500 space-y-3">
                  <p>Speech trial has not been recorded yet in this session.</p>
                  <button
                    onClick={() => onNavigateToTab('speech')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors"
                  >
                    Launch Microphone Recording
                  </button>
                </div>
              )}
            </div>

            {/* Movement Analysis Score Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/80 flex items-center justify-center text-sky-400">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Movement Kinematic Findings</h3>
                    <p className="text-[11px] text-slate-400 font-mono">33 SKELETAL LANDMARKS</p>
                  </div>
                </div>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400">
                  {movementResult ? 'EVALUATED' : 'NOT TESTED'}
                </span>
              </div>

              {movementResult ? (
                <div className="space-y-6">
                  {/* Circular Indicators */}
                  <div className="grid grid-cols-2 gap-4">
                    {renderCircularGauge(
                      movementResult.prediction.pdPatternProbabilityPct,
                      "Parkinson's-Related Movement Patterns",
                      'Asymmetry Alignment',
                      'sky'
                    )}
                    {renderCircularGauge(
                      movementResult.prediction.nonPdPatternProbabilityPct,
                      'Non-Parkinsonian Patterns',
                      'Kinematic Fluidity',
                      'emerald'
                    )}
                  </div>

                  {/* Model Confidence Metric */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block font-mono text-[10px]">MODEL CONFIDENCE SCORE</span>
                      <span className="text-slate-200 font-semibold">
                        Boundary Distance Margin
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold font-mono text-sky-300 tabular-nums">
                        {movementResult.prediction.confidenceScorePct}%
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        (Decision Margin: {movementResult.prediction.decisionMargin})
                      </span>
                    </div>
                  </div>

                  {/* Detected Movement Characteristics */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                      Detected Kinematic Characteristics:
                    </p>
                    <ul className="space-y-1 text-xs text-slate-300 font-mono">
                      {movementResult.prediction.detectedCharacteristics.map((char, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Model Identification & Notice */}
                  <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <p className="text-slate-300 font-sans font-semibold">Model Identification:</p>
                    <p>· {movementResult.prediction.modelName}</p>
                    <p className="text-amber-400/90 pt-1">
                      Notice: Video landmarks processed via dedicated CV pipeline. Not fed into synthetic accelerometer model.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-500 space-y-3">
                  <p>Movement trial has not been recorded yet in this session.</p>
                  <button
                    onClick={() => onNavigateToTab('movement')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors"
                  >
                    Launch Webcam Motion Tracking
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Combined Model Prediction & Scientific Fusion Notice (Mandatory Requirement) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layers className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">Multimodal Fusion & Model Validation Status</h3>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200/90 leading-relaxed space-y-2">
              <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Scientific Rigor Requirement: No Artificial Score Averaging</span>
              </p>
              <p>
                In clinical neurology, phonatory impairment (controlled by cranial nerves IX, X, XII in the bulbar brainstem) and gait asymmetry (governed by basal ganglia-spinal motor loops) reflect distinct physiological pathophysiologies.
              </p>
              <p className="font-mono text-amber-300">
                A single combined percentage is NOT fabricated by averaging the two scores, because no prospective multimodal fusion model has yet been clinically validated across matched co-recorded datasets. In accordance with ISEF standards, the findings are presented as independent orthogonal biomarkers.
              </p>
            </div>

            {/* Comparison Visual Chart */}
            {hasBoth && (
              <div className="pt-2 space-y-4">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Orthogonal Biomarker Comparison (Speech vs Movement)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Parameter 1: Vocal Micro-Perturbation vs Stride Asymmetry */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs font-mono">
                    <div className="flex justify-between items-center text-slate-300 font-sans font-semibold">
                      <span>Phonatory Jitter Perturbation</span>
                      <span className="text-sky-400 font-mono">
                        {speechResult.extractedFeatures.jitter_local_pct}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-sky-400 h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, (speechResult.extractedFeatures.jitter_local_pct / 1.5) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Normal &lt; 1.04%</span>
                      <span>Impact: {speechResult.extractedFeatures.jitter_local_pct > 1.04 ? 'Elevated' : 'Nominal'}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs font-mono">
                    <div className="flex justify-between items-center text-slate-300 font-sans font-semibold">
                      <span>Arm Swing Asymmetry Index</span>
                      <span className="text-sky-400 font-mono">
                        {movementResult.movementMeasurements.symmetry.armSwingAsymmetryPct}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-sky-400 h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(100, (movementResult.movementMeasurements.symmetry.armSwingAsymmetryPct / 25) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Normal &lt; 15.0%</span>
                      <span>
                        Impact: {movementResult.movementMeasurements.symmetry.armSwingAsymmetryPct > 15 ? 'Elevated' : 'Nominal'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Understanding Your Results */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <HelpCircle className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">Understanding Your Results</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-semibold text-white">What Pattern Probability Means</h4>
                <p className="text-slate-400 leading-relaxed">
                  The probability represents statistical similarity to vocal or kinematic patterns in training datasets. It does <strong>not</strong> mean a person has that exact probability of having Parkinson's disease.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-semibold text-white">Probability vs Confidence</h4>
                <p className="text-slate-400 leading-relaxed">
                  Probability is the model's classification score along the decision continuum. Confidence measures distance from the 50% non-informative boundary, reflecting classifier certainty.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-semibold text-white">Healthy vs Atypical Baseline</h4>
                <p className="text-slate-400 leading-relaxed">
                  Temporary vocal strain, room acoustics, clothing contrast, or camera angles can influence raw features. Results must be interpreted strictly in a scientific research context.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SPEECH RESULTS TAB */}
      {activeTab === 'speech' && (
        <div className="space-y-6">
          {speechResult ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Speech Acoustic Telemetry & Classification</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Model: {speechResult.prediction.modelName}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToTab('speech')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700 self-start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repeat Speech Trial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderCircularGauge(
                  speechResult.prediction.pdPatternProbabilityPct,
                  "Parkinson's-Related Speech Patterns",
                  'Acoustic Dysphonia Score',
                  'sky'
                )}
                {renderCircularGauge(
                  speechResult.prediction.nonPdPatternProbabilityPct,
                  'Non-Parkinsonian Speech Patterns',
                  'Phonatory Periodicity',
                  'emerald'
                )}
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <p className="font-semibold text-slate-200">Scientific Model Explanation:</p>
                <p className="text-slate-400 leading-relaxed">{speechResult.prediction.explanation}</p>
                <p className="text-[11px] font-mono text-sky-400 pt-1">{speechResult.prediction.scientificNotes}</p>
              </div>

              {/* Key Features Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Key Biomarker Attributions
                </h4>
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Biomarker Feature</th>
                        <th className="py-2.5 px-3">Observed Value</th>
                        <th className="py-2.5 px-3">Clinical Reference</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Feature Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/60 text-slate-300">
                      {speechResult.prediction.keyExtractedFeatures.map((f, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-semibold text-slate-200">{f.name}</td>
                          <td className="py-2 px-3 font-bold text-sky-300 tabular-nums">{f.value}</td>
                          <td className="py-2 px-3 text-slate-400">{f.reference}</td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                f.status === 'nominal'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800/80'
                              }`}
                            >
                              {f.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right text-slate-400 uppercase text-[10px]">
                            {f.impact}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <Mic className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No Speech Analysis Recorded Yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Record your voice uttering a sustained vowel /a/ to generate the 44-parameter acoustic report.
              </p>
              <button
                onClick={() => onNavigateToTab('speech')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors"
              >
                Go to Speech Analysis
              </button>
            </div>
          )}
        </div>
      )}

      {/* MOVEMENT RESULTS TAB */}
      {activeTab === 'movement' && (
        <div className="space-y-6">
          {movementResult ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Movement Kinematic Telemetry & Classification</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Model: {movementResult.prediction.modelName}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToTab('movement')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700 self-start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repeat Movement Trial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderCircularGauge(
                  movementResult.prediction.pdPatternProbabilityPct,
                  "Parkinson's-Related Movement Patterns",
                  'Kinematic Asymmetry Score',
                  'sky'
                )}
                {renderCircularGauge(
                  movementResult.prediction.nonPdPatternProbabilityPct,
                  'Non-Parkinsonian Patterns',
                  'Bilateral Fluidity',
                  'emerald'
                )}
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <p className="font-semibold text-slate-200">Scientific Model Explanation:</p>
                <p className="text-slate-400 leading-relaxed">{movementResult.prediction.explanation}</p>
                <p className="text-[11px] font-mono text-sky-400 pt-1">{movementResult.prediction.scientificNotes}</p>
              </div>

              {/* Key Features Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Key Kinematic Attributions
                </h4>
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Kinematic Metric</th>
                        <th className="py-2.5 px-3">Measured Value</th>
                        <th className="py-2.5 px-3">Clinical Reference</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Feature Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/60 text-slate-300">
                      {movementResult.prediction.keyExtractedFeatures.map((f, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-semibold text-slate-200">{f.name}</td>
                          <td className="py-2 px-3 font-bold text-sky-300 tabular-nums">{f.value}</td>
                          <td className="py-2 px-3 text-slate-400">{f.reference}</td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                f.status === 'nominal'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800/80'
                              }`}
                            >
                              {f.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right text-slate-400 uppercase text-[10px]">
                            {f.impact}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <Camera className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No Movement Analysis Recorded Yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Record your posture and arm swing using the camera to compute 33-landmark kinematic trajectories.
              </p>
              <button
                onClick={() => onNavigateToTab('movement')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors"
              >
                Go to Movement Analysis
              </button>
            </div>
          )}
        </div>
      )}

      {/* SESSION LOG TAB */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">Session Assessment Log</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {sessionHistory.length} RUNS IN MEMORY
              </span>
            </div>

            {sessionHistory.length > 0 ? (
              <div className="divide-y divide-slate-800/80 font-mono text-xs">
                {sessionHistory.map((item) => (
                  <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                        {item.type === 'speech' ? <Mic className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200">{item.title}</p>
                        <p className="text-[11px] text-slate-500">{new Date(item.timestamp).toLocaleTimeString()} · {item.modelName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-slate-400 block text-[10px]">PD PATTERN</span>
                        <span className="font-bold text-sky-300 tabular-nums">{item.pdProbabilityPct}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">NON-PD</span>
                        <span className="font-bold text-emerald-300 tabular-nums">{item.nonPdProbabilityPct}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">CONFIDENCE</span>
                        <span className="font-bold text-slate-300 tabular-nums">{item.confidencePct}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No trials completed yet in this session.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
