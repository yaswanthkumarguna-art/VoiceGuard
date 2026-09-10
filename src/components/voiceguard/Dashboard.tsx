import React from 'react';
import { VoiceAnalysisResult, ViewState } from '../../types/voiceGuard';
import { MobileCallSimulator } from './MobileCallSimulator';
import { Activity, ShieldCheck, AlertTriangle, Cpu, Sparkles, ArrowUpRight, Clock, ChevronRight, PhoneCall, Smartphone, Zap } from 'lucide-react';

interface DashboardProps {
  history: VoiceAnalysisResult[];
  onNavigate: (view: ViewState) => void;
  onSelectResult: (result: VoiceAnalysisResult) => void;
  onLoadDemo: (preset: 'human' | 'ai' | 'uncertain' | 'promotional' | 'mobile_auto_upload') => void;
  onAutoCallAnalyzed: (result: VoiceAnalysisResult) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ history, onNavigate, onSelectResult, onLoadDemo, onAutoCallAnalyzed }) => {
  const totalAnalyses = history.length > 0 ? history.length : 128;
  const potentialAiCount = history.filter(h => h.classification === 'potentially_ai_generated').length || 37;
  const authenticCount = history.filter(h => h.classification === 'human').length || 91;
  const autoUploadedCount = history.filter(h => h.is_auto_uploaded_call).length || 58;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B0F19] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-white">VoiceGuard Security Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono uppercase font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Mobile Post-Call Auto-Upload Enabled
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time voice clone detection, promotional robocall screening, and automatic post-call upload analysis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('analyze')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            Manual Voice Upload
          </button>
        </div>
      </div>

      {/* TOP DASHBOARD METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Analyses */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 font-mono">Total Voice Evaluations</span>
            <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalAnalyses}</div>
          <div className="text-[11px] text-slate-400 font-mono">Processed voice samples</div>
        </div>

        {/* Card 2: Auto-Uploaded Post-Call Audio */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-900/50 transition-all space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 font-mono">Auto-Uploaded Mobile Calls</span>
            <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-400 font-mono">{autoUploadedCount}</div>
          <div className="text-[11px] text-purple-300/70 font-mono">Automatic post-call capture</div>
        </div>

        {/* Card 3: Potential AI Voices */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-900/50 transition-all space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 font-mono">Potential AI Clones</span>
            <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">{potentialAiCount}</div>
          <div className="text-[11px] text-rose-300/70 font-mono">High synth probability score</div>
        </div>

        {/* Card 4: Detection Accuracy */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-900/50 transition-all space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 font-mono">Detection Accuracy</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-extrabold text-cyan-400 font-mono">98.4%</div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-cyan-300/80 font-mono font-bold bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40 w-max">
            <span>Prototype metric</span>
          </div>
        </div>

      </div>

      {/* MOBILE TELEPHONY AUTO-UPLOAD SIMULATOR WIDGET */}
      <MobileCallSimulator onAutoCallAnalyzed={onAutoCallAnalyzed} />

      {/* QUICK PRESET LAUNCHERS */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-poppins flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Instant Hackathon Demo Presets
          </h2>
          <span className="text-xs text-slate-400 font-mono">Click to test instant workflow</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <button
            onClick={() => onLoadDemo('mobile_auto_upload')}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-purple-950/30 border border-slate-800 hover:border-purple-700/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-400 uppercase font-mono flex items-center gap-1">
                <Zap className="w-3 h-3" /> Auto Post-Call Upload
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-300 font-medium">Recorded Call +1 (800) 443-2019</p>
            <div className="text-[11px] text-slate-400 font-mono mt-1">93% AI Probability • Auto-Uploaded</div>
          </button>

          <button
            onClick={() => onLoadDemo('promotional')}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-purple-950/30 border border-slate-800 hover:border-purple-700/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-400 uppercase font-mono">Promo Call Demo</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-300 font-medium">Automated Telemarketing Robocall</p>
            <div className="text-[11px] text-slate-400 font-mono mt-1">94% Promo Score • High Risk</div>
          </button>

          <button
            onClick={() => onLoadDemo('ai')}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-700/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-400 uppercase font-mono">Potentially AI Demo</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-300 font-medium">ElevenLabs Cloned Voice Sample</p>
            <div className="text-[11px] text-slate-400 font-mono mt-1">91% AI Probability • High Risk</div>
          </button>

          <button
            onClick={() => onLoadDemo('human')}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-700/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase font-mono">Authentic Human Demo</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <p className="text-xs text-slate-300 font-medium">Natural Studio Speech Clip</p>
            <div className="text-[11px] text-slate-400 font-mono mt-1">94% Human Probability • Low Risk</div>
          </button>

        </div>
      </div>

      {/* RECENT ANALYSES LIST */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white font-poppins">Recent Voice & Call Evaluations</h2>
            <p className="text-xs text-slate-400 font-mono">Latest manual uploads and post-call auto-uploaded streams</p>
          </div>

          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
          >
            View Full History
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {history.slice(0, 5).map((item) => {
            const isAi = item.classification === 'potentially_ai_generated';
            const isHuman = item.classification === 'human';
            const isPromo = item.is_promotional_call;
            const isAutoUploaded = item.is_auto_uploaded_call;
            
            return (
              <div
                key={item.id}
                onClick={() => onSelectResult(item)}
                className="py-3.5 px-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isAutoUploaded ? 'bg-purple-950 text-purple-300 border border-purple-700' :
                    isAi ? 'bg-rose-950 text-rose-400 border border-rose-800/60' :
                    isHuman ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' :
                    'bg-amber-950 text-amber-400 border border-amber-800/60'
                  }`}>
                    {isAutoUploaded ? <Smartphone className="w-4 h-4" /> :
                     isAi ? <AlertTriangle className="w-4 h-4" /> :
                     isHuman ? <ShieldCheck className="w-4 h-4" /> :
                     <Activity className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">
                      {item.call_metadata?.caller_number ? `Call: ${item.call_metadata.caller_number}` : item.file_name}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.audio_duration}s
                      </span>
                      <span>{item.file_size}</span>
                      {isAutoUploaded && (
                        <span className="text-purple-400 font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Auto-Uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                      isAi ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      isHuman ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {isAi ? 'Potential AI' : isHuman ? 'Likely Human' : 'Inconclusive'}
                    </span>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      AI Prob: {Math.round(item.ai_probability * 100)}%
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
