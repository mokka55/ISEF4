import React from 'react';
import { ShieldCheck, FileText, CheckCircle, AlertCircle, Lock } from 'lucide-react';

export const ProtocolPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">
          <span>Standardized Clinical Methodology</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>MDS-UPDRS Reference</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Clinical Research Protocol & Data Privacy
        </h1>
        <p className="mt-1 text-sm text-slate-400 max-w-3xl">
          Standardized participant acquisition guidelines for sustained phonation and postural gait assessments, accompanied by strict browser-level privacy and sensory sandboxing principles.
        </p>
      </div>

      {/* Protocol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Protocol 1: Speech */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm border-b border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Protocol A: Sustained Vowel Phonation (/a/)</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Acoustic Environment:</strong> Conduct trial in a quiet room with ambient background noise &lt; 40 dB SPL. Avoid rooms with noticeable echo or reverberation.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Transducer Distance:</strong> Position the laptop or external microphone approximately 15 to 20 cm from the lips at a 45-degree angle to minimize aerodynamic plosive artifacts.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Phonation Production:</strong> Instruct the participant to take a deep inspiration and utter a steady, continuous <em>"Ahhhh"</em> at their habitual pitch and loudness for 3 to 5 seconds.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Acoustic Extraction:</strong> Real-time algorithms compute 44 features including F0, Jitter (RAP/PPQ5), Shimmer (APQ3/APQ11), HNR, and 13 MFCC cepstral bands.
              </div>
            </div>
          </div>
        </div>

        {/* Protocol 2: Movement */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm border-b border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Protocol B: Postural & Gait Kinematics</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Camera Geometry:</strong> Elevate the laptop camera to approximately waist-to-chest height. Ensure the participant stands 2 to 3 meters away so full body landmarks (shoulders to feet) are framed.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Illumination & Attire:</strong> Provide uniform front lighting avoiding heavy backlighting. Wear clothing that contrasts with the background to maximize MediaPipe pose confidence.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Motor Task:</strong> Perform continuous bilateral arm swings, in-place stepping, or a standardized sit-to-stand transition for 5 to 10 seconds.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Kinematic Derivation:</strong> System computes range of motion, left-right bilateral asymmetry index, stride cadence, and normalized jerk trajectory smoothness.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy and Error Governance Principles */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Lock className="w-4 h-4 text-blue-400" />
          <span>Feature 3 Privacy & Error Handling Compliance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <p className="font-semibold text-slate-200">Explicit Permissions</p>
            <p className="text-slate-400">
              Camera and microphone streams require explicit user activation via dedicated "Enable" buttons. No automatic recording or background capturing occurs.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <p className="font-semibold text-slate-200">Local Browser Processing</p>
            <p className="text-slate-400">
              MediaPipe Pose landmark inference and Web Audio API spectral transformations run entirely client-side. Media tracks are stopped immediately upon page exit or disconnection.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <p className="font-semibold text-slate-200">No Unconsented Storage</p>
            <p className="text-slate-400">
              Audio and video recordings exist in volatile browser memory and are only dispatched to backend analytical endpoints when the user clicks "Analyze".
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Non-Diagnostic Disclaimer */}
      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-slate-200">Research Prototype Notice</p>
          <p className="text-slate-400 leading-relaxed">
            ParkSense is an investigational software platform. The acoustic parameters and kinematic metrics generated by this application are intended strictly for scientific research and algorithm development. <strong>The application does not provide medical advice and does not claim to diagnose Parkinson's disease or any neurological disorder.</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
