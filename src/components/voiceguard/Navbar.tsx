import React from 'react';
import { ViewState } from '../../types/voiceGuard';
import { Shield, Sparkles, Activity, History, Info, Play, AlertTriangle, PhoneCall, Smartphone } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLoadDemo: (preset: 'human' | 'ai' | 'uncertain' | 'promotional' | 'mobile_auto_upload') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onLoadDemo }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight font-poppins">VoiceGuard</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Mobile Integrated
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono -mt-1">Auto Post-Call Deepfake & Robocall Defense</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'dashboard'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => onNavigate('analyze')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'analyze' || currentView === 'animating' || currentView === 'result'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Analyze Voice
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'history'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>

          <button
            onClick={() => onNavigate('how-it-works')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'how-it-works'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            How It Works
          </button>
        </nav>

        {/* Linked Mobile Status & Demo Actions */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => onLoadDemo('mobile_auto_upload')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-300 text-xs font-mono font-bold transition-all shadow-md"
            title="Load realistic automatic post-call upload analysis demo"
          >
            <Smartphone className="w-3.5 h-3.5 text-purple-400" />
            <span>⚡ Auto Post-Call Upload</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onLoadDemo('human')}
              className="px-2 py-1 text-xs font-semibold rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 transition-all flex items-center gap-1"
              title="Load human demo"
            >
              <Play className="w-3 h-3 fill-emerald-400" />
              <span className="hidden sm:inline">Human</span>
            </button>

            <button
              onClick={() => onLoadDemo('ai')}
              className="px-2 py-1 text-xs font-semibold rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 transition-all flex items-center gap-1"
              title="Load AI voice clone demo"
            >
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span className="hidden sm:inline">AI Voice</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
