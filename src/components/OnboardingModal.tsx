import React, { useState } from 'react';
import {
  Activity,
  Mic,
  Camera,
  Cpu,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Layers,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFeature?: (feature: 'speech' | 'movement') => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSelectFeature,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  if (!isOpen) return null;

  const handleFinish = (targetFeature?: 'speech' | 'movement') => {
    localStorage.setItem('parkinsense_intro_seen', 'true');
    onClose();
    if (targetFeature && onSelectFeature) {
      onSelectFeature(targetFeature);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header with Progress and Close */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Activity className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">ParkinSense</span>
              <span className="text-[10px] font-mono text-slate-400">RESEARCH PLATFORM ORIENTATION</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentStep === step
                      ? 'w-6 bg-sky-400'
                      : currentStep > step
                      ? 'w-2 bg-blue-600'
                      : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => handleFinish()}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-2"
              title="Skip Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: 4 Screens */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* SCREEN 1: Welcome to ParkinSense */}
          {currentStep === 1 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
                <Activity className="w-9 h-9 text-white" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <span className="text-xs font-mono text-sky-400 uppercase tracking-widest">
                  BIOMEDICAL AI INVESTIGATION
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Understanding Parkinson's Through AI.
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed pt-1">
                  An experimental research platform exploring how artificial intelligence can analyze speech and movement patterns associated with Parkinson's disease.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 max-w-md mx-auto flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Designed for scientific observation, algorithmic research, and ISEF inquiry.</span>
              </div>
            </div>
          )}

          {/* SCREEN 2: Why ParkinSense? */}
          {currentStep === 2 && (
            <div className="space-y-6 py-2">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">
                  CLINICAL RESEARCH MOTIVATION
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Why ParkinSense?</h2>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-3">
                <p>
                  Parkinson's is a progressive neurological disorder that affects movement and can also influence speech and other functions. Recognizing relevant patterns is an important research area.
                </p>
                <p className="text-xs text-slate-400">
                  Traditional neurological evaluations require specialized in-clinic visits and motion labs. ParkinSense explores how commodity browser sensors can non-invasively detect subtle motor perturbations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                    <Mic className="w-4 h-4" />
                    <span>Modality 1: Speech Analysis</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Examines micro-fluctuations in pitch stability (Jitter), loudness perturbation (Shimmer), and harmonics-to-noise ratio during sustained phonation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                    <Camera className="w-4 h-4" />
                    <span>Modality 2: Movement Analysis</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Tracks 33 full-body skeletal coordinates via laptop webcam to measure bilateral arm swing asymmetry, stride cadence, and kinematic trajectory jerk.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: How Does It Work? */}
          {currentStep === 3 && (
            <div className="space-y-6 py-2">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">
                  ANALYTICAL PIPELINE ARCHITECTURE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">How Does It Work?</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-sky-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-sky-400/40">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Record voice or movement</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Using standard browser MediaDevices, capture sustained vowel /a/ or full-body gait movements.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-sky-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-sky-400/40">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">AI extracts relevant characteristics</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Extracts 44 acoustic features (F0, Jitter, Shimmer, HNR, 13 MFCCs) or 33 optical kinematic pose vectors.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-sky-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-sky-400/40">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Machine-learning models analyze features</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Validated classifiers evaluate mathematical similarity against clinical research cohorts (e.g. Oxford Telemonitoring benchmark).
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-sky-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-sky-400/40">
                    4
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">The system displays experimental results</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Review pattern probabilities, model confidence, sub-feature breakdowns, and scientific explanations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/60 text-xs text-sky-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Deterministic ML inference runs directly in local server memory. No random percentages.</span>
              </div>
            </div>
          )}

          {/* SCREEN 4: Explore the Platform */}
          {currentStep === 4 && (
            <div className="space-y-6 py-2">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">
                  INTERACTIVE SUITE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Explore the Platform</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => handleFinish('speech')}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/60 transition-all cursor-pointer group space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-sky-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                      SPEECH ANALYSIS
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Record a voice sample using your microphone. Evaluate 44 acoustic parameters and Oxford classification.
                    </p>
                  </div>
                  <div className="text-[11px] text-sky-400 font-semibold flex items-center gap-1 pt-1">
                    <span>Launch Speech Trial</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div
                  onClick={() => handleFinish('movement')}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/60 transition-all cursor-pointer group space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-sky-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                      MOVEMENT ANALYSIS
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Use your camera to record supported movement tasks. Real-time 33-landmark skeleton tracking and gait kinematics.
                    </p>
                  </div>
                  <div className="text-[11px] text-sky-400 font-semibold flex items-center gap-1 pt-1">
                    <span>Launch Movement Trial</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 italic">
                Note: You can revisit this orientation anytime via the "Orientation Guide" link in the header.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={() => handleFinish()}
              className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
            >
              Skip orientation
            </button>
          )}

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>{currentStep === 1 ? 'START EXPLORING' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => handleFinish()}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 transition-colors shadow-md shadow-emerald-900/30"
            >
              <span>ENTER PARKINSENSE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
