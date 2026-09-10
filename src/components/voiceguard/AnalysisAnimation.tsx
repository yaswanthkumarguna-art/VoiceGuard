import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, Loader2, Activity } from 'lucide-react';

interface AnalysisAnimationProps {
  onComplete: () => void;
}

const STAGES = [
  'Uploading audio',
  'Preprocessing audio',
  'Extracting acoustic features',
  'Generating speech embedding',
  'Running AI voice detector',
  'Calculating authenticity score'
];

export const AnalysisAnimation: React.FC<AnalysisAnimationProps> = ({ onComplete }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    // Stage transition timer
    const stageDuration = 450; // ms per stage
    const totalSteps = STAGES.length;

    const interval = setInterval(() => {
      setCurrentStageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        const calcProgress = Math.min(Math.round(((nextIndex + 1) / totalSteps) * 100), 100);
        setProgressPercent(calcProgress);

        if (nextIndex >= totalSteps) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return prevIndex;
        }
        return nextIndex;
      });
    }, stageDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B0F19] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-8 text-center shadow-2xl relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-600/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Central Pulsing Icon */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-3xl bg-cyan-500/20 border border-cyan-500/40 animate-ping" />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-600 to-indigo-600 border border-cyan-400 flex items-center justify-center text-white shadow-xl shadow-cyan-500/30 relative z-10">
            <Cpu className="w-10 h-10 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-poppins text-white">
            Analyzing Audio Signals
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Evaluating spectral phase, prosody variations, and neural speech embeddings...
          </p>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 animate-spin" />
              {STAGES[currentStageIndex]}
            </span>
            <span className="font-bold text-white">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-300 shadow-md shadow-cyan-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 6 Stage Checklist */}
        <div className="space-y-2 text-left bg-[#070A12] p-4 rounded-2xl border border-slate-800 font-mono text-xs">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  isCurrent ? 'bg-slate-800/80 text-cyan-300 font-bold border border-cyan-800/50' :
                  isDone ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span>{stage}</span>
                </div>

                <span className="text-[10px] uppercase">
                  {isDone ? 'COMPLETED' : isCurrent ? 'PROCESSING' : 'QUEUED'}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
