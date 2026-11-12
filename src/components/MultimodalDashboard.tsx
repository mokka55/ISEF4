import React, { useState, useEffect } from 'react';
import {
  MultimodalAssessmentResult,
  ModelValidationMetrics,
  SpeechAnalysisResult,
  MovementAnalysisResult,
} from '../types';
import { MODEL_VALIDATION_BENCHMARKS } from '../utils/mlModels';
import {
  Activity,
  Mic,
  Camera,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Download,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  TrendingUp,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  Sliders,
} from 'lucide-react';

interface MultimodalDashboardProps {
  multimodalResult: MultimodalAssessmentResult | null;
  voiceResult: SpeechAnalysisResult | null;
  movementResult: MovementAnalysisResult | null;
  onNavigate: (tab: string) => void;
  onClearSession: () => void;
}

export const MultimodalDashboard: React.FC<MultimodalDashboardProps> = ({
  multimodalResult,
  voiceResult,
  movementResult,
  onNavigate,
  onClearSession,
}) => {
  // Assessment history in localStorage
  const [history, setHistory] = useState<MultimodalAssessmentResult[]>([]);
  const [selectedBenchmarkTab, setSelectedBenchmarkTab] = useState<'voice' | 'movement' | 'integrated'>('integrated');

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('parksense_assessment_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load history:', e);
    }
  }, []);

  // Save completed session to history
  useEffect(() => {
    if (multimodalResult && (multimodalResult.voiceAvailable || multimodalResult.movementAvailable)) {
      try {
        const existing = localStorage.getItem('parksense_assessment_history');
        const list: MultimodalAssessmentResult[] = existing ? JSON.parse(existing) : [];
        // Avoid duplicate session ID
        if (!list.some((s) => s.sessionId === multimodalResult.sessionId)) {
          const updated = [multimodalResult, ...list].slice(0, 10);
          setHistory(updated);
          localStorage.setItem('parksense_assessment_history', JSON.stringify(updated));
        }
      } catch (e) {
        console.warn('Failed to save session to history:', e);
      }
    }
  }, [multimodalResult]);

  const activeBenchmark: ModelValidationMetrics = MODEL_VALIDATION_BENCHMARKS[selectedBenchmarkTab];

  // Helper for Circular SVG Gauge
  const renderCircularGauge = (
    value: number | null,
    label: string,
    subLabel: string,
    colorClass: string,
    strokeColor: string
  ) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const pct = value !== null ? Math.min(100, Math.max(0, value)) : 0;
    const strokeDashoffset = circumference - (pct / 100) * circumference;

    return (
      <div className="flex flex-col items-center text-center p-3">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-800"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress ring */}
            {value !== null && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={strokeColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {value !== null ? (
              <>
                <span className={`text-2xl font-bold font-mono ${colorClass}`}>
                  {value}%
                </span>
                <span className="text-[10px] uppercase font-mono text-slate-400">
                  PD Pattern
                </span>
              </>
            ) : (
              <span className="text-xs font-mono text-slate-500 uppercase">
                Pending
              </span>
            )}
          </div>
        </div>
        <div className="mt-2">
          <h4 className="text-xs font-semibold text-slate-200">{label}</h4>
          <p className="text-[11px] text-slate-400 font-mono">{subLabel}</p>
        </div>
      </div>
    );
  };

  // Export Clinical Research Report as HTML Dossier
  const handleDownloadReport = () => {
    if (!multimodalResult) return;

    const reportContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ParkSense Clinical Research Dossier - ${multimodalResult.sessionId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #1e293b; max-width: 850px; margin: 40px auto; padding: 20px; }
    h1 { color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }
    h2 { color: #0369a1; margin-top: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    .meta-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-family: monospace; font-size: 13px; }
    .score-grid { display: flex; gap: 16px; margin: 20px 0; }
    .score-card { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; background: #ffffff; }
    .score-val { font-size: 32px; font-weight: bold; font-family: monospace; color: #0284c7; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; }
    .disclaimer { background: #fffbeb; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin-top: 30px; font-size: 12px; color: #92400e; }
  </style>
</head>
<body>
  <h1>ParkSense Multimodal Biomarker Research Dossier</h1>
  
  <div class="meta-box">
    <strong>SESSION IDENTIFIER:</strong> ${multimodalResult.sessionId}<br>
    <strong>ACQUISITION TIMESTAMP:</strong> ${new Date(multimodalResult.timestamp).toISOString()}<br>
    <strong>FUSION METHODOLOGY:</strong> ${multimodalResult.fusionMethod}<br>
    <strong>DATA QUALITY ASSESSMENT:</strong> ${multimodalResult.overallDataQuality}
  </div>

  <h2>Multimodal Risk Probability Scores</h2>
  <div class="score-grid">
    <div class="score-card">
      <div style="font-size: 12px; color: #64748b;">VOICE MODEL SCORE</div>
      <div class="score-val">${multimodalResult.voiceScore !== null ? `${multimodalResult.voiceScore}%` : 'N/A'}</div>
      <div style="font-size: 11px; color: #64748b;">Acoustic Phonation Classifier</div>
    </div>
    <div class="score-card">
      <div style="font-size: 12px; color: #64748b;">MOVEMENT MODEL SCORE</div>
      <div class="score-val">${multimodalResult.movementScore !== null ? `${multimodalResult.movementScore}%` : 'N/A'}</div>
      <div style="font-size: 11px; color: #64748b;">Kinematic Pose Classifier</div>
    </div>
    <div class="score-card" style="border: 2px solid #0284c7;">
      <div style="font-size: 12px; color: #0369a1; font-weight: bold;">INTEGRATED MODEL SCORE</div>
      <div class="score-val" style="color: #0369a1;">${multimodalResult.integratedScore !== null ? `${multimodalResult.integratedScore}%` : 'PENDING'}</div>
      <div style="font-size: 11px; color: #0369a1; font-weight: 500;">${multimodalResult.classification}</div>
    </div>
  </div>

  <h2>Model Classification Summary</h2>
  <p><strong>Overall Pattern Classification:</strong> ${multimodalResult.classification}</p>
  <p><strong>Confidence Level:</strong> ${multimodalResult.confidenceLevel} | <strong>Quality Rating:</strong> ${multimodalResult.overallDataQuality}</p>
  <p><strong>Fusion Status Notice:</strong> ${multimodalResult.statusNotice}</p>

  <h2>Acoustic Phonation Parameters (Extracted)</h2>
  ${
    multimodalResult.acousticFeaturesSummary
      ? `<table>
          <thead>
            <tr><th>Acoustic Biomarker</th><th>Value</th><th>Clinical Reference Norm</th></tr>
          </thead>
          <tbody>
            <tr><td>Fundamental Frequency (F0 Mean)</td><td>${multimodalResult.acousticFeaturesSummary.f0_mean} Hz</td><td>120 - 220 Hz</td></tr>
            <tr><td>Jitter (Local Perturbation)</td><td>${multimodalResult.acousticFeaturesSummary.jitter_local_pct}%</td><td>&lt; 1.04%</td></tr>
            <tr><td>Shimmer (Local Amplitude Perturbation)</td><td>${multimodalResult.acousticFeaturesSummary.shimmer_local_pct}%</td><td>&lt; 3.81%</td></tr>
            <tr><td>Harmonics-to-Noise Ratio (HNR)</td><td>${multimodalResult.acousticFeaturesSummary.hnr_db} dB</td><td>&gt; 20.0 dB</td></tr>
            <tr><td>Pitch Period Entropy (PPE)</td><td>${multimodalResult.acousticFeaturesSummary.ppe}</td><td>0.10 - 0.35</td></tr>
            <tr><td>Recurrence Period Density (RPDE)</td><td>${multimodalResult.acousticFeaturesSummary.rpde}</td><td>0.20 - 0.60</td></tr>
          </tbody>
        </table>`
      : '<p>Acoustic phonation data was not acquired in this session.</p>'
  }

  <h2>Kinematic Movement Parameters (Extracted)</h2>
  ${
    multimodalResult.kinematicMeasurementsSummary
      ? `<table>
          <thead>
            <tr><th>Kinematic Biomarker</th><th>Value</th><th>Clinical Reference Norm</th></tr>
          </thead>
          <tbody>
            <tr><td>Bilateral Arm Swing Asymmetry</td><td>${multimodalResult.kinematicMeasurementsSummary.symmetry.armSwingAsymmetryPct}%</td><td>&lt; 15.0%</td></tr>
            <tr><td>Bilateral Knee Symmetry Index</td><td>${multimodalResult.kinematicMeasurementsSummary.symmetry.bilateralKneeSymmetryIndex}</td><td>&gt; 0.90 (0-1.0)</td></tr>
            <tr><td>Movement Cadence</td><td>${multimodalResult.kinematicMeasurementsSummary.gaitTiming.cadenceStepsPerMin} steps/min</td><td>95 - 120 steps/min</td></tr>
            <tr><td>Normalized Jerk Smoothness Metric</td><td>${multimodalResult.kinematicMeasurementsSummary.movementSmoothness.normalizedJerkMetric}</td><td>&lt; 0.40 (Lower = smoother)</td></tr>
          </tbody>
        </table>`
      : '<p>Kinematic motion tracking data was not acquired in this session.</p>'
  }

  <div class="disclaimer">
    <strong>IMPORTANT MEDICAL DISCLAIMER:</strong><br>
    ParkSense is an investigational biomedical engineering research prototype, NOT an approved diagnostic medical device. Never interpret these model scores as a confirmed clinical diagnosis of Parkinson's disease. The percentages represent estimated mathematical probabilities of matching patterns within research validation datasets. If you or the participant have health concerns, seek evaluation by a qualified medical neurologist or healthcare professional.
  </div>
</body>
</html>`;

    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ParkSense_Research_Dossier_${multimodalResult.sessionId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Session Identification */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">
            <span>Integrated Multimodal Artificial Intelligence</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Dual-Stream Bayesian Fusion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Multimodal Assessment & Risk Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            Integrates vocal fold acoustic micro-perturbations (Jitter, Shimmer, HNR, MFCCs) with computer-vision gait kinematics (arm swing asymmetry, knee symmetry, jerk smoothness) to compute calibrated research pattern probabilities.
          </p>
        </div>

        {/* Global Dashboard Actions */}
        <div className="flex items-center gap-3">
          {multimodalResult && (
            <button
              onClick={handleDownloadReport}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 font-medium text-xs rounded-lg flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Research Dossier</span>
            </button>
          )}

          <button
            onClick={onClearSession}
            className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg flex items-center gap-1.5 transition-colors border border-slate-800"
            title="Start Fresh Session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Trial</span>
          </button>
        </div>
      </div>

      {/* Prominent Mandatory Medical Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 space-y-1">
          <p className="font-semibold text-amber-300">
            Mandatory Biomedical Research Protocol & Non-Diagnostic Notice
          </p>
          <p className="leading-relaxed">
            ParkSense is an investigational research prototype, not a diagnostic medical device. Never label a user as a confirmed healthy person or Parkinson's patient. The model percentages represent estimated statistical probabilities of matching characteristic patterns within research datasets, not the probability that the user actually has Parkinson's disease. Clinical consultation with a qualified medical specialist is strongly recommended for any neurological concern.
          </p>
        </div>
      </div>

      {/* Primary Multimodal Score Gauges Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Multimodal Fusion Summary
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Dual-Stream Model Scores & Pattern Classification
            </h2>
          </div>

          {/* Classification Pill / Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Model Classification
              </span>
              <span
                className={`text-xs font-bold font-mono px-2.5 py-1 rounded inline-block mt-0.5 ${
                  multimodalResult?.integratedScore !== null && multimodalResult?.integratedScore !== undefined
                    ? multimodalResult.integratedScore >= 50
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {multimodalResult?.classification || 'Pending Complete Trial'}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Circular Gauges: Voice Score, Movement Score, Integrated Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Gauge 1: Voice Model Score */}
          {renderCircularGauge(
            multimodalResult?.voiceScore ?? null,
            'Voice Model Score',
            '44 Acoustic Telemonitoring Features',
            'text-sky-400',
            '#38bdf8'
          )}

          {/* Gauge 2: Movement Model Score */}
          {renderCircularGauge(
            multimodalResult?.movementScore ?? null,
            'Movement Model Score',
            'Pose Kinematics & Trajectories',
            'text-blue-400',
            '#2563eb'
          )}

          {/* Gauge 3: Integrated Model Score */}
          {renderCircularGauge(
            multimodalResult?.integratedScore ?? null,
            'Integrated Model Score',
            'Bayesian Reliability Late-Fusion',
            'text-emerald-400',
            '#10b981'
          )}
        </div>

        {/* Quality and Confidence Footer Strip */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span>Confidence Level:</span>
              <span
                className={`font-semibold ${
                  multimodalResult?.confidenceLevel === 'High'
                    ? 'text-emerald-400'
                    : multimodalResult?.confidenceLevel === 'Moderate'
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}
              >
                {multimodalResult?.confidenceLevel || 'N/A'}
              </span>
            </div>

            <span aria-hidden="true" className="text-slate-700">·</span>

            <div className="flex items-center gap-1.5">
              <span>Overall Data Quality:</span>
              <span
                className={`font-semibold ${
                  multimodalResult?.overallDataQuality === 'Optimal'
                    ? 'text-emerald-400'
                    : multimodalResult?.overallDataQuality === 'Acceptable'
                    ? 'text-sky-400'
                    : 'text-slate-400'
                }`}
              >
                {multimodalResult?.overallDataQuality || 'Pending'}
              </span>
            </div>

            <span aria-hidden="true" className="text-slate-700">·</span>

            <div className="flex items-center gap-1.5">
              <span>Fusion Methodology:</span>
              <span className="text-slate-300">
                {multimodalResult?.fusionMethod || 'Bayesian Late-Fusion'}
              </span>
            </div>
          </div>

          <div className="text-slate-500 text-[11px]">
            Session ID: {multimodalResult?.sessionId || 'NO-ACTIVE-SESSION'}
          </div>
        </div>
      </div>

      {/* Single Modality Warning Banner if only 1 modality is recorded */}
      {(!multimodalResult?.voiceAvailable || !multimodalResult?.movementAvailable) && (
        <div className="p-5 rounded-xl bg-slate-900 border border-amber-800/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-amber-200">
                Integrated Multimodal Assessment Unavailable
              </h3>
              <p className="text-xs text-slate-300">
                {multimodalResult?.statusNotice ||
                  'Both Voice Analysis and Movement Analysis trials are strictly required to compute the fused multimodal prediction.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!multimodalResult?.voiceAvailable && (
              <button
                onClick={() => onNavigate('speech')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Record Voice Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {!multimodalResult?.movementAvailable && (
              <button
                onClick={() => onNavigate('movement')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Record Movement Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Individual Modality Assessment Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modality Card 1: Voice Analysis */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Voice Analysis Module</h3>
                <p className="text-[11px] text-slate-400 font-mono">44 Phonation Acoustic Features</p>
              </div>
            </div>

            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                multimodalResult?.voiceAvailable
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {multimodalResult?.voiceAvailable ? 'TRIAL ACQUIRED' : 'NOT RECORDED'}
            </span>
          </div>

          {multimodalResult?.voicePrediction ? (
            <div className="space-y-4">
              {/* Individual Probability Bars */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Parkinson's-related pattern probability:</span>
                  <span className="font-bold text-sky-400 tabular-nums text-sm">
                    {multimodalResult.voicePrediction.parkinsonPatternPct}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-sky-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${multimodalResult.voicePrediction.parkinsonPatternPct}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-slate-400 pt-1">
                  <span>Non-Parkinson's-related pattern probability:</span>
                  <span className="font-semibold text-slate-300 tabular-nums">
                    {multimodalResult.voicePrediction.comparisonPatternPct}%
                  </span>
                </div>
              </div>

              {/* Classification & Confidence */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Classification:</span>
                  <span className="font-semibold text-slate-200">
                    {multimodalResult.voicePrediction.classification}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Quality Score:</span>
                  <span className="font-mono text-emerald-400">
                    {multimodalResult.voicePrediction.dataQualityScore}/100 ({multimodalResult.voicePrediction.dataQualityAssessment})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Logit Score:</span>
                  <span className="font-mono text-slate-300">
                    {multimodalResult.voicePrediction.logitScore}
                  </span>
                </div>
              </div>

              {/* Top Contributing Acoustic Features */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  Top Contributing Acoustic Biomarkers
                </span>
                <div className="space-y-1.5 text-xs font-mono">
                  {multimodalResult.voicePrediction.topContributingBiomarkers.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80"
                    >
                      <span className="text-slate-300">{b.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{b.value}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            b.impact === 'elevated'
                              ? 'bg-amber-950 text-amber-300'
                              : b.impact === 'reduced'
                              ? 'bg-sky-950 text-sky-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {b.impact.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('speech')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-medium rounded-lg transition-colors border border-slate-700 flex items-center justify-center gap-2"
              >
                <span>View Full 44 Phonation Parameters</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs space-y-3">
              <p>No vocal recording analyzed in this session.</p>
              <button
                onClick={() => onNavigate('speech')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Go to Speech Analysis</span>
              </button>
            </div>
          )}
        </div>

        {/* Modality Card 2: Movement Analysis */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-sky-400">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Movement Analysis Module</h3>
                <p className="text-[11px] text-slate-400 font-mono">MediaPipe 33 Pose Landmarks</p>
              </div>
            </div>

            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                multimodalResult?.movementAvailable
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {multimodalResult?.movementAvailable ? 'TRIAL ACQUIRED' : 'NOT RECORDED'}
            </span>
          </div>

          {multimodalResult?.movementPrediction ? (
            <div className="space-y-4">
              {/* Individual Probability Bars */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Parkinson's-related pattern probability:</span>
                  <span className="font-bold text-blue-400 tabular-nums text-sm">
                    {multimodalResult.movementPrediction.parkinsonPatternPct}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${multimodalResult.movementPrediction.parkinsonPatternPct}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-slate-400 pt-1">
                  <span>Non-Parkinson's-related pattern probability:</span>
                  <span className="font-semibold text-slate-300 tabular-nums">
                    {multimodalResult.movementPrediction.comparisonPatternPct}%
                  </span>
                </div>
              </div>

              {/* Classification & Confidence */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Classification:</span>
                  <span className="font-semibold text-slate-200">
                    {multimodalResult.movementPrediction.classification}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Quality Score:</span>
                  <span className="font-mono text-emerald-400">
                    {multimodalResult.movementPrediction.dataQualityScore}/100 ({multimodalResult.movementPrediction.dataQualityAssessment})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Logit Score:</span>
                  <span className="font-mono text-slate-300">
                    {multimodalResult.movementPrediction.logitScore}
                  </span>
                </div>
              </div>

              {/* Top Contributing Kinematic Features */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">
                  Top Contributing Kinematic Biomarkers
                </span>
                <div className="space-y-1.5 text-xs font-mono">
                  {multimodalResult.movementPrediction.topContributingBiomarkers.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80"
                    >
                      <span className="text-slate-300">{b.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{b.value}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            b.impact === 'elevated'
                              ? 'bg-amber-950 text-amber-300'
                              : b.impact === 'reduced'
                              ? 'bg-sky-950 text-sky-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {b.impact.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('movement')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-medium rounded-lg transition-colors border border-slate-700 flex items-center justify-center gap-2"
              >
                <span>View Full Kinematic Trajectory Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs space-y-3">
              <p>No movement recording analyzed in this session.</p>
              <button
                onClick={() => onNavigate('movement')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Go to Movement Analysis</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Model Performance & Scientific Validation Benchmarks */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-wider mb-0.5">
              <span>Scientific Empirical Validation</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Zero Data Leakage Protocols</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Model Diagnostic Performance Benchmarks
            </h3>
          </div>

          {/* Model Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg text-xs">
            <button
              onClick={() => setSelectedBenchmarkTab('voice')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                selectedBenchmarkTab === 'voice'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Voice Model
            </button>
            <button
              onClick={() => setSelectedBenchmarkTab('movement')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                selectedBenchmarkTab === 'movement'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Movement Model
            </button>
            <button
              onClick={() => setSelectedBenchmarkTab('integrated')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                selectedBenchmarkTab === 'integrated'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Integrated Fusion
            </button>
          </div>
        </div>

        {/* Selected Model Details & Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
          <div className="md:col-span-4 space-y-3 font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">MODEL ARCHITECTURE</span>
              <span className="font-semibold text-slate-200 text-xs">
                {activeBenchmark.architecture}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">BENCHMARK DATASET</span>
              <span className="text-slate-300 text-xs">
                {activeBenchmark.dataset} ({activeBenchmark.samplesCount} cohort samples)
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">VALIDATION PROTOCOL</span>
              <span className="text-slate-300 text-xs">
                {activeBenchmark.crossValidation}
              </span>
            </div>
          </div>

          {/* Validation Metrics Grid */}
          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-400 block">ROC-AUC</span>
                <span className="text-xl font-bold text-sky-400 tabular-nums">
                  {activeBenchmark.rocAuc.toFixed(3)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Area Under Curve</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-400 block">SENSITIVITY</span>
                <span className="text-xl font-bold text-emerald-400 tabular-nums">
                  {(activeBenchmark.sensitivity * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">True Positive Rate</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-400 block">SPECIFICITY</span>
                <span className="text-xl font-bold text-emerald-400 tabular-nums">
                  {(activeBenchmark.specificity * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">True Negative Rate</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-400 block">PRECISION</span>
                <span className="text-xl font-bold text-slate-200 tabular-nums">
                  {(activeBenchmark.precision * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Pos. Predictive Value</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-400 block">RECALL</span>
                <span className="text-xl font-bold text-slate-200 tabular-nums">
                  {(activeBenchmark.recall * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Coverage</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-400 block">F1-SCORE</span>
                <span className="text-xl font-bold text-sky-300 tabular-nums">
                  {activeBenchmark.f1Score.toFixed(3)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Harmonic Balance</span>
              </div>
            </div>

            {/* Empirical Confusion Matrix */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-300 font-sans font-semibold">
                <span>Holdout Validation Confusion Matrix</span>
                <span className="text-[11px] font-mono text-slate-400">
                  N = {activeBenchmark.samplesCount} Test Partitions
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
                <div className="p-2.5 rounded bg-slate-900 border border-emerald-800/60">
                  <span className="text-[10px] text-slate-400 block">TRUE POSITIVE (TP)</span>
                  <span className="text-lg font-bold text-emerald-400 tabular-nums">
                    {activeBenchmark.confusionMatrix.truePositive}
                  </span>
                  <span className="text-[10px] text-emerald-500/80 block">PD Correctly Identified</span>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-rose-900/40">
                  <span className="text-[10px] text-slate-400 block">FALSE POSITIVE (FP)</span>
                  <span className="text-lg font-bold text-rose-400 tabular-nums">
                    {activeBenchmark.confusionMatrix.falsePositive}
                  </span>
                  <span className="text-[10px] text-rose-500/80 block">Control Flagged as PD</span>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-rose-900/40">
                  <span className="text-[10px] text-slate-400 block">FALSE NEGATIVE (FN)</span>
                  <span className="text-lg font-bold text-rose-400 tabular-nums">
                    {activeBenchmark.confusionMatrix.falseNegative}
                  </span>
                  <span className="text-[10px] text-rose-500/80 block">PD Missed</span>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-emerald-800/60">
                  <span className="text-[10px] text-slate-400 block">TRUE NEGATIVE (TN)</span>
                  <span className="text-lg font-bold text-emerald-400 tabular-nums">
                    {activeBenchmark.confusionMatrix.trueNegative}
                  </span>
                  <span className="text-[10px] text-emerald-500/80 block">Control Correctly Identified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment History Section */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">Assessment History</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {history.length} SESSION{history.length === 1 ? '' : 'S'} STORED
          </span>
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Session ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3 text-right">Voice Score</th>
                  <th className="py-2.5 px-3 text-right">Movement Score</th>
                  <th className="py-2.5 px-3 text-right">Integrated Score</th>
                  <th className="py-2.5 px-3 text-right">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-2 px-3 font-semibold text-sky-400">{item.sessionId}</td>
                    <td className="py-2 px-3 text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      {item.voiceScore !== null ? `${item.voiceScore}%` : '—'}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      {item.movementScore !== null ? `${item.movementScore}%` : '—'}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums font-bold text-emerald-400">
                      {item.integratedScore !== null ? `${item.integratedScore}%` : 'Pending'}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          item.classification.includes('Parkinson')
                            ? 'bg-amber-950 text-amber-300'
                            : 'bg-emerald-950 text-emerald-300'
                        }`}
                      >
                        {item.classification}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-500 text-xs bg-slate-950 rounded-lg border border-slate-800">
            No historical trials logged yet. Complete speech and movement assessments to record trials.
          </div>
        )}
      </div>
    </div>
  );
};
