import React from 'react';
import { Mic, Camera, Activity, ShieldCheck, Cpu, ArrowRight, BarChart3, Radio } from 'lucide-react';

interface OverviewPageProps {
  onNavigate: (tab: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/60 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <span>MULTIMODAL NEUROLOGICAL BIOMARKER RESEARCH PLATFORM</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>VERSION 2.4</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            ParkSense Precision Telemetry
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            ParkSense investigates non-invasive digital biomarkers of Parkinsonian motor and phonation dysfunction. Utilizing high-fidelity browser sensory APIs, the platform captures sustained vowel phonation via microphone and 33-point body skeletal kinematics via optical camera tracking.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('speech')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <Mic className="w-4 h-4" />
              <span>Launch Speech Recording</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('movement')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Camera className="w-4 h-4" />
              <span>Launch Camera Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('results')}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors border border-slate-700"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>AI Results Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Core Modalities Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modality 1: Speech Phonation */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-800/80 flex items-center justify-center text-sky-400">
              <Mic className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Speech Acoustic Biometric Engine</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time Web Audio API and MediaRecorder capture sustained phonation to extract 44 standardized acoustic parameters: fundamental frequency (F0), cycle-to-cycle perturbation (Jitter RAP/PPQ5), amplitude perturbation (Shimmer APQ3/APQ11), Harmonics-to-Noise Ratio (HNR), and 13-band Mel-Frequency Cepstral Coefficients (MFCCs).
            </p>

            <div className="pt-2 text-xs font-mono text-slate-300 space-y-1">
              <p className="text-slate-400 font-sans font-semibold">Implemented Capabilities:</p>
              <p>· Live oscilloscope & FFT frequency spectrum rendering</p>
              <p>· Recording controls (Start, Pause, Resume, Stop, Replay, Delete)</p>
              <p>· Lossless audio export (.webm / .wav download)</p>
              <p>· Standard 44 acoustic feature extraction pipeline</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('speech')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 font-medium text-xs rounded-lg transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
          >
            <span>Open Speech Module</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modality 2: Movement & Pose */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-800/80 flex items-center justify-center text-sky-400">
              <Camera className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Camera Pose Kinematic Engine</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time MediaPipe Pose Landmarker tracks 33 body landmarks (shoulders, elbows, wrists, hips, knees, ankles, feet) at 30 FPS. Computes dynamic joint trajectories, bilateral arm swing asymmetry, movement cadence, and normalized jerk trajectory smoothness.
            </p>

            <div className="pt-2 text-xs font-mono text-slate-300 space-y-1">
              <p className="text-slate-400 font-sans font-semibold">Implemented Capabilities:</p>
              <p>· Live webcam feed with cyan/cobalt skeleton overlay</p>
              <p>· Real-time joint angle and coordinate readout HUD</p>
              <p>· Motion sequence recording & video file download</p>
              <p>· Dedicated CV backend endpoint (POST /api/movement/analyze)</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('movement')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 font-medium text-xs rounded-lg transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
          >
            <span>Open Movement Module</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Research Disclaimer & Ethics Banner */}
      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-slate-200">
            Permanent Research Notice & Ethical Boundary
          </p>
          <p className="text-slate-400 leading-relaxed">
            ParkinSense is an experimental AI-based research prototype designed to analyze speech and movement patterns associated with Parkinson's disease. It is not a medical diagnostic tool. Its results do not confirm or exclude Parkinson's disease. Consult a qualified healthcare professional for medical assessment.
          </p>
        </div>
      </div>
    </div>
  );
};
