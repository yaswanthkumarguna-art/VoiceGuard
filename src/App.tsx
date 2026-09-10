import React, { useState, useEffect } from 'react';
import { ViewState, VoiceAnalysisResult } from './types/voiceGuard';
import { voiceDetectionService, DEMO_PRESETS } from './services/voiceDetectionService';

import { Navbar } from './components/voiceguard/Navbar';
import { LandingPage } from './components/voiceguard/LandingPage';
import { Dashboard } from './components/voiceguard/Dashboard';
import { AnalyzeVoice } from './components/voiceguard/AnalyzeVoice';
import { AnalysisAnimation } from './components/voiceguard/AnalysisAnimation';
import { ResultsView } from './components/voiceguard/ResultsView';
import { AnalysisHistory } from './components/voiceguard/AnalysisHistory';
import { HowItWorks } from './components/voiceguard/HowItWorks';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [history, setHistory] = useState<VoiceAnalysisResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<VoiceAnalysisResult | null>(null);

  const [pendingFile, setPendingFile] = useState<{ file: File | Blob; name: string } | null>(null);

  useEffect(() => {
    const loadedHistory = voiceDetectionService.getHistory();
    setHistory(loadedHistory);
  }, []);

  const handleLoadDemo = (preset: 'human' | 'ai' | 'uncertain' | 'promotional' | 'mobile_auto_upload') => {
    const demoData = DEMO_PRESETS[preset];
    setSelectedResult(demoData);
    voiceDetectionService.saveToHistory(demoData);
    setHistory(voiceDetectionService.getHistory());
    setCurrentView('result');
  };

  const handleStartAnalysis = (fileOrBlob: File | Blob, filename: string) => {
    setPendingFile({ file: fileOrBlob, name: filename });
    setCurrentView('animating');
  };

  const handleAnimationComplete = async () => {
    if (pendingFile) {
      const result = await voiceDetectionService.analyzeVoice(pendingFile.file, pendingFile.name);
      setSelectedResult(result);
      setHistory(voiceDetectionService.getHistory());
      setPendingFile(null);
      setCurrentView('result');
    } else {
      handleLoadDemo('ai');
    }
  };

  // Called when automatic post-call upload completes from MobileCallSimulator
  const handleAutoCallAnalyzed = (result: VoiceAnalysisResult) => {
    setSelectedResult(result);
    setHistory(voiceDetectionService.getHistory());
    setCurrentView('result');
  };

  const handleSelectHistoryItem = (item: VoiceAnalysisResult) => {
    setSelectedResult(item);
    setCurrentView('result');
  };

  const handleDeleteHistory = () => {
    voiceDetectionService.deleteHistory();
    setHistory([]);
    setSelectedResult(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onLoadDemo={handleLoadDemo}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={(view) => setCurrentView(view)}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            history={history}
            onNavigate={(view) => setCurrentView(view)}
            onSelectResult={handleSelectHistoryItem}
            onLoadDemo={handleLoadDemo}
            onAutoCallAnalyzed={handleAutoCallAnalyzed}
          />
        )}

        {currentView === 'analyze' && (
          <AnalyzeVoice
            onStartAnalysis={handleStartAnalysis}
          />
        )}

        {currentView === 'animating' && (
          <AnalysisAnimation
            onComplete={handleAnimationComplete}
          />
        )}

        {currentView === 'result' && selectedResult && (
          <ResultsView
            result={selectedResult}
            onNavigate={(view) => setCurrentView(view)}
            onAnalyzeAnother={() => setCurrentView('analyze')}
          />
        )}

        {currentView === 'history' && (
          <AnalysisHistory
            history={history}
            onSelectResult={handleSelectHistoryItem}
            onDeleteHistory={handleDeleteHistory}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'how-it-works' && (
          <HowItWorks
            onNavigate={(view) => setCurrentView(view)}
          />
        )}
      </main>

      <footer className="border-t border-slate-800/80 bg-[#070A12] py-6 px-4 text-center text-xs text-slate-500 font-mono space-y-1">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <span className="font-bold text-white">VoiceGuard</span>
          <span>•</span>
          <span>Mobile Integrated Post-Call Auto-Upload & AI Voice Clone System</span>
          <span>•</span>
          <span className="text-purple-400">Hackathon Prototype Edition</span>
        </div>
        <p>Built with React, TypeScript, Web Audio API, Mobile Telephony Listeners, and FastAPI Inference Service Architecture.</p>
      </footer>
    </div>
  );
};

export default App;
