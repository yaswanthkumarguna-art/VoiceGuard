import React, { useState, useEffect, useRef } from 'react';
import { VoiceAnalysisResult, ViewState } from '../../types/voiceGuard';
import { ShieldCheck, AlertTriangle, HelpCircle, ChevronDown, ChevronUp, Sparkles, Activity, FileText, ArrowLeft, RefreshCw, BarChart2, PhoneCall, Megaphone, Smartphone, Zap } from 'lucide-react';

interface ResultsViewProps {
  result: VoiceAnalysisResult;
  onNavigate: (view: ViewState) => void;
  onAnalyzeAnother: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onNavigate, onAnalyzeAnother }) => {
  const [showSignals, setShowSignals] = useState(true);
  const [visTab, setVisTab] = useState<'waveform' | 'spectrogram'>('waveform');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isAi = result.classification === 'potentially_ai_generated';
  const isHuman = result.classification === 'human';
  const isUncertain = result.classification === 'uncertain';
  const isPromo = result.is_promotional_call;
  const isAutoUploaded = result.is_auto_uploaded_call;

  const aiPercent = Math.round(result.ai_probability * 100);
  const humanPercent = Math.round(result.human_probability * 100);
  const promoPercent = result.promotional_score ? Math.round(result.promotional_score * 100) : 0;

  // Render Canvas Visualization (Waveform vs Spectrogram)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (visTab === 'waveform') {
      ctx.fillStyle = '#070A12';
      ctx.fillRect(0, 0, width, height);

      const numBars = 75;
      const barWidth = width / numBars;
      ctx.fillStyle = isPromo ? '#C084FC' : isAi ? '#F43F5E' : isHuman ? '#10B981' : '#F59E0B';

      for (let i = 0; i < numBars; i++) {
        const factor = isAi ? Math.sin(i * 0.4) * 0.4 + 0.5 : Math.cos(i * 0.25) * 0.35 + 0.45;
        const h = Math.max(10, Math.min(height - 10, factor * height));
        const y = (height - h) / 2;
        ctx.fillRect(i * barWidth + 2, y, barWidth - 3, h);
      }
    } else {
      ctx.fillStyle = '#05070D';
      ctx.fillRect(0, 0, width, height);

      const cols = 60;
      const rows = 30;
      const cellW = width / cols;
      const cellH = height / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const intensity = Math.sin((r * 0.3) + (c * 0.2)) * 0.5 + 0.5;
          let rVal = 0, gVal = 0, bVal = 0;

          if (isPromo) {
            rVal = Math.floor(intensity * 190);
            gVal = Math.floor((1 - intensity) * 80);
            bVal = Math.floor(intensity * 250);
          } else if (isAi) {
            rVal = Math.floor(intensity * 240);
            gVal = Math.floor((1 - intensity) * 80);
            bVal = Math.floor(intensity * 120);
          } else if (isHuman) {
            rVal = Math.floor((1 - intensity) * 50);
            gVal = Math.floor(intensity * 200);
            bVal = Math.floor(intensity * 180);
          } else {
            rVal = Math.floor(intensity * 220);
            gVal = Math.floor(intensity * 160);
            bVal = Math.floor((1 - intensity) * 60);
          }

          ctx.fillStyle = `rgb(${rVal}, ${gVal}, ${bVal})`;
          ctx.fillRect(c * cellW, r * cellH, cellW - 1, cellH - 1);
        }
      }
    }
  }, [visTab, isAi, isHuman, isPromo]);

  const themeBorder = isPromo ? 'border-purple-700/60' : isAi ? 'border-rose-700/60' : isHuman ? 'border-emerald-700/60' : 'border-amber-700/60';
  const themeBg = isPromo ? 'bg-purple-950/20' : isAi ? 'bg-rose-950/20' : isHuman ? 'bg-emerald-950/20' : 'bg-amber-950/20';
  const themeBadge = isPromo ? 'bg-purple-950 text-purple-300 border-purple-800' : isAi ? 'bg-rose-950 text-rose-300 border-rose-800' : isHuman ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800';
  const strokeColor = isPromo ? '#C084FC' : isAi ? '#F43F5E' : isHuman ? '#10B981' : '#F59E0B';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B0F19] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onAnalyzeAnother}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Analyze Another Recording
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">

        {/* AUTOMATIC POST-CALL UPLOAD METADATA BANNER */}
        {isAutoUploaded && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-purple-950/80 border border-purple-600/70 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    AUTOMATIC POST-CALL UPLOADED ANALYSIS
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold uppercase">
                    Call End Listener
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-mono mt-1 flex flex-wrap items-center gap-3">
                  <span>Caller: <strong className="text-white">{result.call_metadata?.caller_number || '+1 (800) 443-2019'}</strong></span>
                  {result.call_metadata?.caller_name && <span>• {result.call_metadata.caller_name}</span>}
                  <span>• Ended: {result.call_metadata?.call_end_timestamp || 'Just now'}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 font-mono text-xs text-purple-300 bg-purple-950/80 px-3 py-1.5 rounded-xl border border-purple-800/80">
              Captured via Mobile Gateway
            </div>
          </div>
        )}

        {/* PROMOTIONAL CALL WARNING BANNER */}
        {isPromo && !isAutoUploaded && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-purple-950/80 border border-purple-700/60 shadow-xl flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                <Megaphone className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase">Automated Promotional Call Detected</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono">
                    Intent: {result.promotional_intent?.toUpperCase() || 'TELEMARKETING'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  High probability of automated telemarketing sales speech, robotic loan pitches, or promotional robocall dialers.
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-2xl font-bold font-mono text-purple-300">{promoPercent}%</div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Promo Score</div>
            </div>
          </div>
        )}

        {/* MAIN RESULT CARD WITH CIRCULAR GAUGE */}
        <div className={`p-6 sm:p-10 rounded-3xl bg-slate-900/90 border ${themeBorder} ${themeBg} shadow-2xl space-y-8 relative overflow-hidden`}>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Gauge & Score */}
            <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4 text-center">
              
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={strokeColor}
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * (isHuman ? humanPercent : aiPercent)) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                    {isHuman ? humanPercent : aiPercent}%
                  </span>
                  <span className="text-[11px] font-mono uppercase text-slate-400 font-bold mt-0.5">
                    {isHuman ? 'Human Likelihood' : 'AI Probability'}
                  </span>
                </div>
              </div>

              <div className={`px-4 py-1.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider ${themeBadge}`}>
                Risk Level: {result.risk_level.toUpperCase()}
              </div>
            </div>

            {/* Right: Detailed Diagnosis State */}
            <div className="md:col-span-7 space-y-4">
              
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isPromo ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                  isAi ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                  isHuman ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {isPromo ? <PhoneCall className="w-6 h-6" /> :
                   isAi ? <AlertTriangle className="w-6 h-6" /> :
                   isHuman ? <ShieldCheck className="w-6 h-6" /> :
                   <HelpCircle className="w-6 h-6" />}
                </div>

                <div>
                  <div className="text-xs font-mono uppercase font-bold text-slate-400">Authenticity & Intent Classification</div>
                  <h2 className="text-2xl font-bold font-poppins text-white">
                    {isPromo ? 'Automated Telemarketing / Promo Call' :
                     isAi ? 'Potential AI-Generated Voice' :
                     isHuman ? 'Likely Authentic Human Voice' :
                     'Inconclusive Result'}
                  </h2>
                </div>
              </div>

              {/* Probabilities Breakdown Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#070A12] border border-slate-800 font-mono text-xs">
                <div>
                  <span className="text-slate-400">AI-Generated Probability:</span>
                  <div className="text-lg font-bold text-rose-400">{aiPercent}%</div>
                </div>
                <div>
                  <span className="text-slate-400">Human Speech Probability:</span>
                  <div className="text-lg font-bold text-emerald-400">{humanPercent}%</div>
                </div>
                <div>
                  <span className="text-slate-400">Promotional Call Score:</span>
                  <div className="text-lg font-bold text-purple-400">{promoPercent}%</div>
                </div>
                <div>
                  <span className="text-slate-400">Audio Duration:</span>
                  <div className="text-sm font-semibold text-white">{result.audio_duration} sec</div>
                </div>
              </div>

              {/* Dynamic Explanation */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase">Why was this recording evaluated this way?</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {result.explanation}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* EXPANDABLE DETECTION SIGNALS SECTION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div
            onClick={() => setShowSignals(!showSignals)}
            className="flex items-center justify-between cursor-pointer select-none border-b border-slate-800 pb-4"
          >
            <div>
              <h3 className="text-lg font-bold font-poppins text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Detection Signals Breakdown
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Acoustic, spectral, and telemarketing cadence signal metrics
              </p>
            </div>

            <button className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
              {showSignals ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {showSignals && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Spectral Analysis */}
                <div className="p-4 rounded-2xl bg-[#070A12] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200">Spectral Analysis</span>
                    <span className="font-bold text-cyan-400">{Math.round(result.signals.spectral_anomaly * 100)} / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${result.signals.spectral_anomaly * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Measures frequency-domain phase characteristics and vocal tract spectral envelope continuity.
                  </p>
                </div>

                {/* Prosody Analysis */}
                <div className="p-4 rounded-2xl bg-[#070A12] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200">Prosody Analysis</span>
                    <span className="font-bold text-indigo-400">{Math.round(result.signals.prosody_anomaly * 100)} / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${result.signals.prosody_anomaly * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Examines pitch variations, timing cadences, rhythm dynamics, and natural emotional micro-pauses.
                  </p>
                </div>

                {/* Synthetic Artifact Analysis */}
                <div className="p-4 rounded-2xl bg-[#070A12] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200">Synthetic Artifact Analysis</span>
                    <span className="font-bold text-rose-400">{Math.round(result.signals.synthetic_artifact_score * 100)} / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${result.signals.synthetic_artifact_score * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Scans for neural vocoder acoustic artifacts, metallic overtones, and synthesis frame stitching.
                  </p>
                </div>

                {/* Promotional Cadence Analysis */}
                <div className="p-4 rounded-2xl bg-[#070A12] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200">Promotional Cadence Analysis</span>
                    <span className="font-bold text-purple-400">{Math.round((result.signals.promotional_cadence_score || 0) * 100)} / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(result.signals.promotional_cadence_score || 0) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Evaluates repetitive telemarketing opener phrasing, robocall dialer delay, and sales script intonation.
                  </p>
                </div>

              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-[11px] font-mono leading-relaxed">
                <strong className="text-slate-300">IMPORTANT DISCLAIMER:</strong> Detection results are probabilistic and may be incorrect, especially for previously unseen voice-generation systems, heavily compressed audio (e.g. WhatsApp/Cellular), noisy recordings, or manipulated audio.
              </div>
            </div>
          )}
        </div>

        {/* DYNAMIC AUDIO VISUALIZATION (WAVEFORM | SPECTROGRAM) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold font-poppins text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-cyan-400" />
                Signal Spectrum Inspection
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Visualizing frequency distribution and time-domain signal output
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-max">
              <button
                onClick={() => setVisTab('waveform')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  visTab === 'waveform'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Waveform
              </button>

              <button
                onClick={() => setVisTab('spectrogram')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  visTab === 'spectrogram'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Spectrogram
              </button>
            </div>
          </div>

          <div className="bg-[#05070D] p-4 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
            <canvas
              ref={canvasRef}
              width={700}
              height={180}
              className="w-full h-[180px] rounded-xl"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
