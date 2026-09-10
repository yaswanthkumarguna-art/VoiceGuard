import React, { useState, useEffect, useRef } from 'react';
import { voiceDetectionService } from '../../services/voiceDetectionService';
import { VoiceAnalysisResult } from '../../types/voiceGuard';
import { Phone, PhoneOff, PhoneIncoming, Radio, ShieldCheck, AlertTriangle, Zap, CheckCircle2, RefreshCw, Settings, Smartphone } from 'lucide-react';

interface MobileCallSimulatorProps {
  onAutoCallAnalyzed: (result: VoiceAnalysisResult) => void;
}

export const MobileCallSimulator: React.FC<MobileCallSimulatorProps> = ({ onAutoCallAnalyzed }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [autoUploadActive, setAutoUploadActive] = useState<boolean>(true);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [tempPhoneInput, setTempPhoneInput] = useState('');

  // Call simulation state
  const [callState, setCallState] = useState<'idle' | 'incoming' | 'in_call' | 'uploading'>('idle');
  const [simulatedCallerNumber, setSimulatedCallerNumber] = useState<string>('+1 (800) 443-2019');
  const [simulatedCallerName, setSimulatedCallerName] = useState<string>('Unknown / Bank Security Alert');
  const [isSuspiciousScenario, setIsSuspiciousScenario] = useState<boolean>(true);
  const [callSeconds, setCallSeconds] = useState(0);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const phone = voiceDetectionService.getLinkedPhoneNumber();
    const enabled = voiceDetectionService.isAutoUploadEnabled();
    setPhoneNumber(phone);
    setTempPhoneInput(phone);
    setAutoUploadActive(enabled);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempPhoneInput.trim()) {
      setPhoneNumber(tempPhoneInput.trim());
      voiceDetectionService.setLinkedPhoneNumber(tempPhoneInput.trim());
      setIsEditingPhone(false);
    }
  };

  const toggleAutoUpload = () => {
    const nextVal = !autoUploadActive;
    setAutoUploadActive(nextVal);
    voiceDetectionService.setAutoUploadEnabled(nextVal);
  };

  // Start Incoming Call Simulation
  const triggerIncomingCall = (scenario: 'suspicious' | 'authentic') => {
    if (scenario === 'suspicious') {
      setSimulatedCallerNumber('+1 (800) 443-2019');
      setSimulatedCallerName('Unknown / Bank Impersonator');
      setIsSuspiciousScenario(true);
    } else {
      setSimulatedCallerNumber('+1 (415) 890-1122');
      setSimulatedCallerName('David (Colleague)');
      setIsSuspiciousScenario(false);
    }
    setCallState('incoming');
  };

  // Answer Call
  const answerCall = () => {
    setCallState('in_call');
    setCallSeconds(0);
    timerRef.current = window.setInterval(() => {
      setCallSeconds(prev => prev + 1);
    }, 1000);
  };

  // End Call & Trigger Automatic Post-Call Upload
  const endCallAndAutoUpload = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCallState('uploading');

    // Simulate auto-upload delay
    const duration = Math.max(12, callSeconds);
    setTimeout(async () => {
      const result = await voiceDetectionService.simulateMobileCallUpload(
        simulatedCallerNumber,
        simulatedCallerName,
        duration,
        'incoming',
        isSuspiciousScenario
      );
      setCallState('idle');
      onAutoCallAnalyzed(result);
    }, 1500);
  };

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Title & Linked Phone Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-poppins text-white">Mobile Call Auto-Upload Integration</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active Monitor
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Automatically captures and uploads call audio stream as soon as a call ends.
            </p>
          </div>
        </div>

        {/* Linked Phone Number Badge & Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {isEditingPhone ? (
            <form onSubmit={handleSavePhone} className="flex items-center gap-2">
              <input
                type="text"
                value={tempPhoneInput}
                onChange={e => setTempPhoneInput(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-500 text-xs font-mono text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
              >
                Save
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 bg-[#070A12] px-3.5 py-1.5 rounded-xl border border-slate-800">
              <Phone className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-mono font-bold text-slate-200">{phoneNumber}</span>
              <button
                onClick={() => setIsEditingPhone(true)}
                className="p-1 rounded text-slate-500 hover:text-slate-300"
                title="Edit linked mobile phone number"
              >
                <Settings className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LIVE SIMULATOR CONTROL BOX */}
      {callState === 'idle' && (
        <div className="p-5 rounded-2xl bg-[#070A12] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white font-mono">Test Automatic Post-Call Upload Workflow</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Simulate Telephony Call End Event</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <button
              onClick={() => triggerIncomingCall('suspicious')}
              className="p-4 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-rose-400 font-mono flex items-center gap-1.5">
                  <PhoneIncoming className="w-3.5 h-3.5" />
                  Simulate Bank Impersonator Call
                </span>
                <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-900">
                  Suspicious
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Incoming call from +1 (800) 443-2019. Tests automatic post-call AI clone & robocall analysis.
              </p>
            </button>

            <button
              onClick={() => triggerIncomingCall('authentic')}
              className="p-4 rounded-xl bg-slate-900 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-800/60 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                  <PhoneIncoming className="w-3.5 h-3.5" />
                  Simulate Authentic Colleague Call
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900">
                  Human
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Incoming call from +1 (415) 890-1122. Tests post-call verification of authentic human speech.
              </p>
            </button>

          </div>
        </div>
      )}

      {/* STATE: INCOMING CALL */}
      {callState === 'incoming' && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-purple-950/60 border border-purple-700/80 text-center space-y-5 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 animate-pulse text-purple-400" />
            INCOMING MOBILE CALL TO {phoneNumber}
          </div>

          <div className="space-y-1">
            <h4 className="text-2xl font-bold font-mono text-white tracking-wide">{simulatedCallerNumber}</h4>
            <p className="text-xs text-slate-400 font-mono">{simulatedCallerName}</p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={answerCall}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <Phone className="w-4 h-4" />
              Answer Call
            </button>
            <button
              onClick={() => setCallState('idle')}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              Decline Call
            </button>
          </div>
        </div>
      )}

      {/* STATE: CALL IN PROGRESS */}
      {callState === 'in_call' && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-800/80 text-center space-y-5 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              LIVE TELEPHONY AUDIO STREAMING
            </span>
            <span className="text-slate-300">Connected: {simulatedCallerNumber}</span>
          </div>

          {/* Call Timer */}
          <div className="text-3xl font-extrabold font-mono text-white tracking-wider">
            {formatSecs(callSeconds)}
          </div>

          {/* Live Call Audio Waveform */}
          <div className="h-12 flex items-center justify-center gap-1 bg-slate-900 rounded-xl px-4 border border-slate-800">
            {[45, 80, 30, 95, 60, 40, 85, 55, 90, 35, 70, 50, 80, 65, 40, 75, 90, 30, 60, 85].map((h, idx) => (
              <div
                key={idx}
                className="w-1.5 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full animate-pulse"
                style={{ height: `${h}%`, animationDelay: `${idx * 0.05}s` }}
              />
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={endCallAndAutoUpload}
              className="px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center gap-2 mx-auto transition-all"
            >
              <PhoneOff className="w-4 h-4" />
              Hang Up / End Call (Triggers Auto-Upload)
            </button>
          </div>
        </div>
      )}

      {/* STATE: AUTOMATIC UPLOADING & ANALYZING */}
      {callState === 'uploading' && (
        <div className="p-6 rounded-2xl bg-purple-950/40 border border-purple-700/80 text-center space-y-4 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-500/50 flex items-center justify-center mx-auto text-purple-300">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold font-poppins text-white">
              ⚡ Call Ended — Automatic Upload in Progress
            </h4>
            <p className="text-xs font-mono text-purple-300">
              Capturing recorded call audio from {simulatedCallerNumber} and sending to VoiceGuard Neural Detector...
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
