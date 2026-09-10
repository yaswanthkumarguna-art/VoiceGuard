import React from 'react';
import { ViewState } from '../../types/voiceGuard';
import { Shield, Sparkles, Activity, Lock, Cpu, ArrowRight, CheckCircle2, AlertTriangle, PhoneCall, Megaphone } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: ViewState) => void;
  onLoadDemo: (preset: 'human' | 'ai' | 'uncertain' | 'promotional') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onLoadDemo }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B0F19] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/60">
        
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                AI Voice Clone & Promotional Robocall Defense
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-poppins tracking-tight text-white leading-[1.1]">
                Can You Trust <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                  the Voice?
                </span>
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                VoiceGuard analyzes audio samples to detect synthetic voice cloning, impersonation attacks, and automated promotional telemarketing robocalls.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => onNavigate('analyze')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold text-base shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-cyan-200" />
                  Analyze a Voice
                </button>

                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base transition-all flex items-center justify-center gap-2"
                >
                  See How It Works
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Demo presets prompt */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-400 font-mono">
                <span>Try instant demo presets:</span>
                <button
                  onClick={() => onLoadDemo('promotional')}
                  className="px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-800/60 text-purple-300 hover:bg-purple-900/80 transition-colors"
                >
                  ⚡ Promo Call
                </button>
                <button
                  onClick={() => onLoadDemo('ai')}
                  className="px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-800/60 text-rose-300 hover:bg-rose-900/80 transition-colors"
                >
                  ⚡ AI Voice
                </button>
                <button
                  onClick={() => onLoadDemo('human')}
                  className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/80 transition-colors"
                >
                  ⚡ Human Demo
                </button>
              </div>

            </div>

            {/* Right Visual */}
            <div className="lg:col-span-5">
              <div className="relative p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-2xl backdrop-blur-xl space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    Real-time Signal Inspector
                  </span>
                </div>

                <div className="bg-[#070A12] p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Input Audio Waveform</span>
                    <span className="text-cyan-400">16kHz Mono WAV</span>
                  </div>

                  <div className="h-20 flex items-center justify-center gap-1">
                    {[35, 60, 20, 85, 45, 90, 30, 75, 40, 95, 65, 30, 80, 50, 100, 70, 40, 85, 55, 90, 30, 70, 45, 80, 25, 60, 90, 40].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
                        style={{
                          height: `${h}%`,
                          animation: `pulse 1.5s infinite ease-in-out ${i * 0.08}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 text-slate-500 font-mono text-xs">
                  <span>Audio Stream</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>Robocall Cadence Engine</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>Score</span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-purple-950/40 border border-purple-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                      <Megaphone className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-purple-400 uppercase font-bold">Detection Result</div>
                      <div className="text-sm font-bold text-white">Promotional Robocall Call</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold font-mono text-purple-400">94%</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Promo Score</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <section className="py-20 bg-[#080C15] border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold font-poppins text-white">
              Complete Voice & Call Defense Suite
            </h2>
            <p className="text-slate-400 text-sm">
              Designed specifically for individuals, call centers, and security analysts to screen voice cloning and spam calls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Detect */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 transition-all hover:-translate-y-1 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-poppins">AI Clone Detect</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyze audio samples for acoustic anomalies, phase discontinuities, and high-frequency patterns associated with synthetic speech.
              </p>
            </div>

            {/* Promotional Call Detection */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-purple-500/40 transition-all hover:-translate-y-1 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-poppins">Promo Call Filter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Detect automated telemarketing sales speech, robotic loan offers, and repetitive robocall dialer openers.
              </p>
            </div>

            {/* Explain */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-blue-500/40 transition-all hover:-translate-y-1 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-700/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-poppins">Explain</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gain clear insight into why a recording was flagged with spectral, prosodic, synthetic artifact, and promo cadence scores.
              </p>
            </div>

            {/* Protect */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/40 transition-all hover:-translate-y-1 space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-poppins">Protect</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide an additional warning layer against voice impersonation scams, CEO phishing, and fake phone verification calls.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* PRIVACY SECTION */}
      <section className="py-16 bg-[#080C15]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-white font-poppins">Privacy & Ethical AI Commitment</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Voice recordings contain sensitive biometric information. VoiceGuard is designed with privacy-first principles: recordings are analyzed in transient sessions, local data can be cleared instantly via deletion controls, and demo metrics explicitly distinguish prototype inference from production models.
          </p>
        </div>
      </section>

    </div>
  );
};
