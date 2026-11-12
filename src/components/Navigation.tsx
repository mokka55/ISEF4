import React from 'react';
import { HardwareStatus, RecordingState, AnalysisStatus } from '../types';
import { Activity, Mic, Camera, ShieldCheck, Download, RefreshCw } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  micStatus: HardwareStatus;
  cameraStatus: HardwareStatus;
  recordingState: RecordingState;
  analysisStatus: AnalysisStatus;
  onOpenTour?: () => void;
  hasResults?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  micStatus,
  cameraStatus,
  recordingState,
  analysisStatus,
  onOpenTour,
  hasResults,
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'speech', label: 'Speech Analysis' },
    { id: 'movement', label: 'Movement Analysis' },
    { id: 'results', label: 'AI Results Dashboard' },
    { id: 'protocol', label: 'Clinical Protocol' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold tracking-tighter shadow-sm">
            <Activity className="w-5 h-5 text-sky-200" />
          </div>
          <button
            onClick={() => setActiveTab('overview')}
            className="text-left font-bold text-lg tracking-tight text-white hover:text-sky-300 transition-colors whitespace-nowrap"
          >
            ParkinSense
          </button>
        </div>

        {/* Zone 2: 4-5 Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-sm flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-sky-400 text-sky-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.id === 'results' && hasResults && (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions (Tour + Assessment) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap border border-slate-700"
            >
              Platform Tour
            </button>
          )}

          <button
            onClick={() => setActiveTab('speech')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors whitespace-nowrap shadow-sm"
          >
            Live Assessment
          </button>
        </div>
      </div>

      {/* Hardware & Telemetry Ribbon */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-1.5 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-slate-400">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Microphone Status */}
            <div className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Microphone:</span>
              <span
                className={`font-semibold ${
                  micStatus === 'connected'
                    ? 'text-emerald-400'
                    : micStatus === 'connecting'
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}
              >
                {micStatus === 'connected' ? 'Connected' : micStatus === 'connecting' ? 'Requesting...' : 'Disconnected'}
              </span>
            </div>

            <span aria-hidden="true" className="text-slate-700">·</span>

            {/* Camera Status */}
            <div className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Camera:</span>
              <span
                className={`font-semibold ${
                  cameraStatus === 'connected'
                    ? 'text-emerald-400'
                    : cameraStatus === 'connecting'
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}
              >
                {cameraStatus === 'connected' ? 'Connected' : cameraStatus === 'connecting' ? 'Requesting...' : 'Disconnected'}
              </span>
            </div>

            <span aria-hidden="true" className="text-slate-700">·</span>

            {/* Recording Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Recording:</span>
              <span
                className={`font-semibold ${
                  recordingState === 'recording'
                    ? 'text-rose-400'
                    : recordingState === 'paused'
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}
              >
                {recordingState === 'recording'
                  ? 'Active'
                  : recordingState === 'paused'
                  ? 'Paused'
                  : 'Stopped'}
              </span>
            </div>

            <span aria-hidden="true" className="text-slate-700">·</span>

            {/* Analysis Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Analysis:</span>
              <span
                className={`font-semibold ${
                  analysisStatus === 'processing'
                    ? 'text-sky-400'
                    : analysisStatus === 'completed' || analysisStatus === 'awaiting'
                    ? 'text-emerald-400'
                    : analysisStatus === 'failed'
                    ? 'text-rose-400'
                    : 'text-slate-400'
                }`}
              >
                {analysisStatus === 'idle'
                  ? 'Pending'
                  : analysisStatus === 'processing'
                  ? 'Processing'
                  : analysisStatus === 'awaiting' || analysisStatus === 'completed'
                  ? 'Completed'
                  : 'Failed'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Research Prototype · Non-Diagnostic</span>
          </div>
        </div>
      </div>

      {/* Mobile nav bar for small screens */}
      <div className="md:hidden flex overflow-x-auto gap-3 px-4 py-2 bg-slate-900 border-t border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-2.5 py-1 text-xs rounded ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white font-medium'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
