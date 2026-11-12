import React, { useState, useEffect } from 'react';
import {
  HardwareStatus,
  RecordingState,
  AnalysisStatus,
  SpeechAnalysisResult,
  MovementAnalysisResult,
  SessionAssessmentItem,
} from './types';
import { Navigation } from './components/Navigation';
import { OverviewPage } from './components/OverviewPage';
import { SpeechAnalysisPage } from './components/SpeechAnalysisPage';
import { MovementAnalysisPage } from './components/MovementAnalysisPage';
import { ResultsDashboard } from './components/ResultsDashboard';
import { SensorModelPage } from './components/SensorModelPage';
import { ProtocolPage } from './components/ProtocolPage';
import { OnboardingModal } from './components/OnboardingModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Global telemetry indicators for hardware ribbon
  const [micStatus, setMicStatus] = useState<HardwareStatus>('disconnected');
  const [cameraStatus, setCameraStatus] = useState<HardwareStatus>('disconnected');
  const [recordingState, setRecordingState] = useState<RecordingState>('inactive');
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');

  // AI Analysis Results State
  const [speechResult, setSpeechResult] = useState<SpeechAnalysisResult | null>(null);
  const [movementResult, setMovementResult] = useState<MovementAnalysisResult | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionAssessmentItem[]>([]);

  // First-time visitor onboarding tour state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check if first-time visitor
    const seen = localStorage.getItem('parkinsense_intro_seen');
    if (!seen) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleSpeechStatus = (
    mic: HardwareStatus,
    rec: RecordingState,
    analysis: AnalysisStatus
  ) => {
    setMicStatus(mic);
    setRecordingState(rec);
    setAnalysisStatus(analysis);
  };

  const handleMovementStatus = (
    cam: HardwareStatus,
    rec: RecordingState,
    analysis: AnalysisStatus
  ) => {
    setCameraStatus(cam);
    setRecordingState(rec);
    setAnalysisStatus(analysis);
  };

  const handleSpeechComplete = (result: SpeechAnalysisResult) => {
    setSpeechResult(result);
    if (result.prediction) {
      const newItem: SessionAssessmentItem = {
        id: `speech-${Date.now()}`,
        type: 'speech',
        timestamp: Date.now(),
        title: 'Sustained Phonation (/a/) Acoustic Assessment',
        modelName: result.prediction.modelName,
        pdProbabilityPct: result.prediction.pdPatternProbabilityPct,
        nonPdProbabilityPct: result.prediction.nonPdPatternProbabilityPct,
        confidencePct: result.prediction.confidenceScorePct,
        summary: `Jitter: ${result.extractedFeatures.jitter_local_pct}%, HNR: ${result.extractedFeatures.hnr_db} dB`,
      };
      setSessionHistory((prev) => [newItem, ...prev]);
    }
  };

  const handleMovementComplete = (result: MovementAnalysisResult) => {
    setMovementResult(result);
    if (result.prediction) {
      const newItem: SessionAssessmentItem = {
        id: `move-${Date.now()}`,
        type: 'movement',
        timestamp: Date.now(),
        title: '33-Landmark Optical Kinematic Gait Trial',
        modelName: result.prediction.modelName,
        pdProbabilityPct: result.prediction.pdPatternProbabilityPct,
        nonPdProbabilityPct: result.prediction.nonPdPatternProbabilityPct,
        confidencePct: result.prediction.confidenceScorePct,
        summary: `Arm Swing Asymmetry: ${result.movementMeasurements.symmetry.armSwingAsymmetryPct}%, Jerk: ${result.movementMeasurements.movementSmoothness.normalizedJerkMetric}`,
      };
      setSessionHistory((prev) => [newItem, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* First-Time Visitor Onboarding Tour Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSelectFeature={(feat) => setActiveTab(feat)}
      />

      {/* Top Bar with Top Bar Contract & Telemetry Ribbon */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        micStatus={micStatus}
        cameraStatus={cameraStatus}
        recordingState={recordingState}
        analysisStatus={analysisStatus}
        onOpenTour={() => setIsOnboardingOpen(true)}
        hasResults={speechResult !== null || movementResult !== null}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <OverviewPage
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'speech' && (
          <SpeechAnalysisPage
            onStatusChange={handleSpeechStatus}
            onAnalysisComplete={handleSpeechComplete}
            onNavigateToResults={() => setActiveTab('results')}
          />
        )}
        {activeTab === 'movement' && (
          <MovementAnalysisPage
            onStatusChange={handleMovementStatus}
            onAnalysisComplete={handleMovementComplete}
            onNavigateToResults={() => setActiveTab('results')}
          />
        )}
        {activeTab === 'results' && (
          <ResultsDashboard
            speechResult={speechResult}
            movementResult={movementResult}
            sessionHistory={sessionHistory}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'accelerometer' && <SensorModelPage />}
        {activeTab === 'protocol' && <ProtocolPage />}
      </main>

      {/* Clean Scientific Footer with Permanent Research Disclaimer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">ParkinSense</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Multimodal Telemonitoring Biomarker Platform</span>
          </div>

          <div className="text-center sm:text-right text-slate-400 text-[11px] max-w-xl">
            <span>
              ParkinSense is an experimental AI-based research prototype designed to analyze speech and movement patterns associated with Parkinson's disease. It is not a medical diagnostic tool. Its results do not confirm or exclude Parkinson's disease. Consult a qualified healthcare professional for medical assessment.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
