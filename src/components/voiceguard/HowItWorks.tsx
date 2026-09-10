import React from 'react';
import { ViewState } from '../../types/voiceGuard';
import { Cpu, ArrowDown, Sparkles, Shield, Lock, FileCode, CheckCircle2, PhoneCall, Smartphone, Zap } from 'lucide-react';

interface HowItWorksProps {
  onNavigate: (view: ViewState) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B0F19] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700/50 text-purple-300 text-xs font-mono">
          <Smartphone className="w-3.5 h-3.5" />
          Mobile Telephony & Neural Engine Specs
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-poppins text-white">
          How VoiceGuard Auto-Uploads & Analyzes Calls
        </h1>
        <p className="text-sm text-slate-400">
          Learn how native mobile telephony call listeners automatically capture recorded audio streams upon call end and perform instant real-time deepfake & robocall classification.
        </p>
      </div>

      {/* 5-STEP VISUAL PIPELINE */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold font-poppins text-white text-center">
          The 5-Step Telephony & Analysis Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          {/* Step 1 */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 relative group hover:border-cyan-500/50 transition-all">
            <div className="text-xl font-extrabold font-mono text-cyan-400">01</div>
            <h3 className="text-sm font-bold text-white font-poppins">Mobile Call End Event</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Target mobile device completes an incoming or outgoing call. Telephony listener hook detects `ACTION_CALL_ENDED`.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 relative group hover:border-purple-500/50 transition-all">
            <div className="text-xl font-extrabold font-mono text-purple-400">02</div>
            <h3 className="text-sm font-bold text-white font-poppins">Auto Post-Call Upload</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Background service automatically streams recorded call audio to VoiceGuard's secure API endpoint without manual effort.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 relative group hover:border-blue-500/50 transition-all">
            <div className="text-xl font-extrabold font-mono text-blue-400">03</div>
            <h3 className="text-sm font-bold text-white font-poppins">Feature Extraction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts acoustic spectral anomalies, prosody pitch variation, vocoder phase artifacts, and telemarketing cadence.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 relative group hover:border-indigo-500/50 transition-all">
            <div className="text-xl font-extrabold font-mono text-indigo-400">04</div>
            <h3 className="text-sm font-bold text-white font-poppins">AI Classification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Wav2Vec2 / HuBERT neural models evaluate synthetic clone probability and robocall telemarketing intent.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 relative group hover:border-emerald-500/50 transition-all">
            <div className="text-xl font-extrabold font-mono text-emerald-400">05</div>
            <h3 className="text-sm font-bold text-white font-poppins">Instant Security Alert</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Displays real-time post-call risk score, caller number verification, and actionable fraud prevention warnings.
            </p>
          </div>

        </div>
      </div>

      {/* MOBILE TELEPHONY ARCHITECTURE DIAGRAM */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold font-poppins text-white text-center">
          Mobile Telephony Auto-Upload Architecture Diagram
        </h3>

        <div className="p-6 rounded-2xl bg-[#070A12] border border-slate-800 font-mono text-xs text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-200">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">📱 Mobile Phone (+1 555-019-2834)</span>
            <span className="text-purple-400">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-purple-950 text-purple-300 border border-purple-800 font-bold">Call End Broadcast Receiver</span>
            <span className="text-purple-400">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">Encrypted POST /api/auto-upload-call</span>
            <span className="text-purple-400">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800">VoiceGuard Neural Model</span>
            <span className="text-purple-400">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">Security Assessment Push</span>
          </div>
        </div>
      </div>

      {/* TECHNICAL SECTION: AI DETECTION ENGINE */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold font-poppins text-white">AI & Mobile Telephony Integration Stack</h3>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-mono font-bold uppercase">
              Production Specs
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Intended production mobile hook + backend ML stack
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="p-5 rounded-2xl bg-[#070A12] border border-slate-800 space-y-3">
            <h4 className="font-bold text-white font-poppins text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              Mobile Telephony Hooks
            </h4>
            <ul className="space-y-2 font-mono text-[11px] text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                Android `TelephonyManager` & `CallScreeningService` API
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                iOS CallKit & Voiceover Telephony extension hooks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                Twilio / SIP Webhook Listener for Cloud PBX Call Streams
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                Background auto-upload daemon with low power consumption
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#070A12] border border-slate-800 space-y-3">
            <h4 className="font-bold text-white font-poppins text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              API & Inference Architecture
            </h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-2">
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-bold text-purple-400">Mobile Client:</span>
                <span>Linked Device Listener</span>
              </div>
              <div className="text-center text-slate-500">↓ Auto-Upload</div>
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-bold text-blue-400">API Endpoint:</span>
                <span>FastAPI (POST /api/auto-upload-call)</span>
              </div>
              <div className="text-center text-slate-500">↓</div>
              <div className="flex items-center justify-between text-slate-200">
                <span className="font-bold text-indigo-400">ML Engine:</span>
                <span>Python + PyTorch Neural Model</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA FOOTER */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 border border-slate-800 text-center space-y-4">
        <h3 className="text-xl font-bold font-poppins text-white">Ready to test automatic mobile call detection?</h3>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-purple-500/20 hover:shadow-purple-500/35 transition-all inline-flex items-center gap-2"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          Go to Mobile Call Simulator on Dashboard
        </button>
      </div>

    </div>
  );
};
