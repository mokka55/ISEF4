import React from 'react';
import { Cpu, AlertTriangle, Layers, Radio, CheckCircle2, ShieldAlert } from 'lucide-react';

export const SensorModelPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">
          <span>Architectural Segregation Notice</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>IMU Sensor vs Optical CV Pipelines</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Experimental Movement Model Architecture
        </h1>
        <p className="mt-1 text-sm text-slate-400 max-w-3xl">
          Specification of the physical and algorithmic boundary between the legacy synthetic accelerometer model and the newly implemented browser computer-vision pose tracking pipeline.
        </p>
      </div>

      {/* Critical Isolation Callout */}
      <div className="p-6 rounded-xl bg-amber-950/40 border border-amber-800/60 space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Segregation Directive: Synthetic Accelerometer vs Video Landmarks</span>
        </div>
        <p className="text-xs text-amber-200/90 leading-relaxed">
          The existing experimental movement model was trained strictly on synthetic 3-axis accelerometer signals (ax, ay, az in m/s² sampled at 100 Hz). Camera landmarks from MediaPipe Pose represent 2D normalized screen coordinates (x, y, z) sampled at 30 Hz without physical mass calibration.
        </p>
        <p className="text-xs text-amber-300 font-bold">
          Under no circumstances should optical camera coordinates be fed directly into the synthetic accelerometer model. A dedicated computer-vision kinematic pipeline is established, and classification model integration remains pending until validated on real labelled optical movement corpora.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Synthetic Accelerometer Model */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Experimental Accelerometer Model</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              SYNTHETIC SENSOR
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 block font-sans">Input Data Modality:</span>
              <p className="font-mono text-slate-200 mt-0.5">Tri-axial Inertial Measurement Unit (IMU) time-series ($a_x, a_y, a_z$)</p>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">Sampling Frequency:</span>
              <p className="font-mono text-slate-200 mt-0.5">100 Hz – 200 Hz continuous high-rate telemetry</p>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">Sensor Placement:</span>
              <p className="font-mono text-slate-200 mt-0.5">Physical hardware wrist/lumbar wearable strapped to participant</p>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">Target Phenomenon:</span>
              <p className="font-mono text-slate-200 mt-0.5">High-frequency resting tremor (3-7 Hz) and postural micro-tremor (8-12 Hz)</p>
            </div>
          </div>
        </div>

        {/* Optical Computer Vision Pipeline */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Computer Vision Kinematic Pipeline</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
              ACTIVE CV PIPELINE
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 block font-sans">Input Data Modality:</span>
              <p className="font-mono text-slate-200 mt-0.5">33-point normalized skeletal landmark vectors via MediaPipe Pose</p>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">Sampling Frequency:</span>
              <p className="font-mono text-slate-200 mt-0.5">25 Hz – 30 Hz browser webcam video frame rate</p>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">Sensor Placement:</span>
              <p className="font-mono text-slate-200 mt-0.5">Contactless laptop camera positioned 2-3 meters from participant</p>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">Target Phenomenon:</span>
              <p className="font-mono text-slate-200 mt-0.5">Gross spatial-temporal gait kinematics, arm swing asymmetry, normalized jerk smoothness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Roadmap Status */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold text-white">Status of Model Integration</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The computer-vision kinematic extractor is fully active and reporting live joint trajectories, symmetry metrics, cadence, and jerk values. The classification model head remains in the <strong>Awaiting Integration</strong> status until verified on clinical multi-center video recordings.
        </p>
        <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Endpoint active: POST /api/movement/analyze responding with verified measurement matrix.</span>
        </div>
      </div>
    </div>
  );
};
