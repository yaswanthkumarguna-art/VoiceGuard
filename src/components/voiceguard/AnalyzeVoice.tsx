import React, { useState, useRef, useEffect } from 'react';
import { Upload, Mic, MicOff, Play, Pause, Volume2, Sparkles, FileAudio, AlertCircle, RefreshCw } from 'lucide-react';

interface AnalyzeVoiceProps {
  onStartAnalysis: (fileOrBlob: File | Blob, filename: string) => void;
}

export const AnalyzeVoice: React.FC<AnalyzeVoiceProps> = ({ onStartAnalysis }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState<string>('');
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Microphone recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevelBars, setAudioLevelBars] = useState<number[]>([15, 30, 45, 20, 60, 40, 80, 50, 30, 70]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup object URLs and audio contexts
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [audioUrl]);

  // Handle Drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setErrorMsg(null);
    const validExtensions = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/ogg', 'audio/x-m4a', 'audio/aac'];
    const maxBytes = 25 * 1024 * 1024; // 25 MB

    if (file.size > maxBytes) {
      setErrorMsg('File size exceeds the 25 MB hackathon demo limit.');
      return;
    }

    if (!validExtensions.some(ext => file.type.includes(ext.split('/')[1])) && !file.name.match(/\.(wav|mp3|m4a|ogg|aac)$/i)) {
      setErrorMsg('Unsupported file format. Please upload WAV, MP3, M4A, or OGG.');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSizeStr((file.size / (1024 * 1024)).toFixed(2) + ' MB');

    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    // Read audio duration
    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
      if (tempAudio.duration && isFinite(tempAudio.duration)) {
        setAudioDuration(Number(tempAudio.duration.toFixed(1)));
      } else {
        setAudioDuration(14.2);
      }
    };
  };

  // Start Mic Recording
  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const name = `recorded_voice_${Date.now()}.wav`;
        setSelectedFile(audioBlob);
        setFileName(name);
        setFileSizeStr((audioBlob.size / 1024).toFixed(1) + ' KB');

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const tempAudio = new Audio(url);
        tempAudio.onloadedmetadata = () => {
          setAudioDuration(Number((tempAudio.duration || 6.5).toFixed(1)));
        };

        // Stop mic track
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      // Start timer
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
        // Randomize live mic level bars for visual effect
        setAudioLevelBars(Array.from({ length: 16 }, () => Math.floor(Math.random() * 80) + 15));
      }, 500);

    } catch (err) {
      console.error('Microphone error:', err);
      setErrorMsg('Microphone access denied or unavailable. Please check browser permissions.');
    }
  };

  // Stop Mic Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  // Play/Pause Audio Preview
  const togglePlayPreview = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleAnalyzeClick = () => {
    if (selectedFile) {
      onStartAnalysis(selectedFile, fileName);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B0F19] text-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Title Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold font-poppins text-white">
            Analyze a Voice Recording
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Upload or record an audio sample to analyze signals associated with synthetic speech.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Upload / Mic Container */}
        {!isRecording && !selectedFile && (
          <div className="space-y-6">
            
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center space-y-4 ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-950/30 shadow-2xl shadow-cyan-500/20'
                  : 'border-slate-800 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900/90'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".wav,.mp3,.m4a,.ogg,.aac"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center mx-auto text-cyan-400 shadow-lg">
                <Upload className="w-8 h-8" />
              </div>

              <div>
                <p className="text-base font-bold text-white">
                  Drag & drop your audio file here
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Supported formats: <strong className="text-slate-300">WAV • MP3 • M4A • OGG</strong>
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Maximum demo file size: 25 MB
                </p>
              </div>

              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all inline-flex items-center gap-2 border border-slate-700"
              >
                Browse Audio File
              </button>
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
              <div className="h-px bg-slate-800 flex-1" />
              <span>OR RECORD SPEECH</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            {/* Record Voice Button */}
            <button
              onClick={startRecording}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/60 hover:from-rose-900/60 hover:to-rose-900/60 border border-rose-800/60 text-white font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-lg group"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-4 h-4 text-rose-400" />
              </div>
              <span>Record Voice Sample via Microphone</span>
            </button>

          </div>
        )}

        {/* ACTIVE RECORDING DISPLAY */}
        {isRecording && (
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-rose-700/60 text-center space-y-6 animate-fade-in shadow-2xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              MICROPHONE ACTIVE
            </div>

            {/* Recording Timer */}
            <div className="text-4xl font-extrabold font-mono text-white tracking-widest">
              {formatSeconds(recordingSeconds)}
            </div>

            {/* Live Audio Level Waveform */}
            <div className="h-16 flex items-center justify-center gap-1.5 px-4 bg-[#070A12] rounded-2xl border border-slate-800">
              {audioLevelBars.map((level, i) => (
                <div
                  key={i}
                  className="w-2 bg-gradient-to-t from-rose-600 to-amber-500 rounded-full transition-all duration-200"
                  style={{ height: `${level}%` }}
                />
              ))}
            </div>

            {/* Stop Recording CTA */}
            <button
              onClick={stopRecording}
              className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center gap-2 mx-auto"
            >
              <MicOff className="w-4 h-4" />
              Stop Recording
            </button>
          </div>
        )}

        {/* POST-UPLOAD / PRE-ANALYSIS FILE INSPECTOR */}
        {selectedFile && !isRecording && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <FileAudio className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-poppins">{fileName}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                    <span>Duration: <strong className="text-slate-200">{audioDuration}s</strong></span>
                    <span>•</span>
                    <span>Size: <strong className="text-slate-200">{fileSizeStr}</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedFile(null);
                  setAudioUrl(null);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-xs font-mono flex items-center gap-1"
                title="Choose another file"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change
              </button>
            </div>

            {/* HTML5 Audio Player & Visualizer */}
            {audioUrl && (
              <div className="bg-[#070A12] p-4 rounded-2xl border border-slate-800 space-y-4">
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={handleAudioEnded}
                  className="hidden"
                />

                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={togglePlayPreview}
                    className="w-12 h-12 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-transform hover:scale-105 shrink-0"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                  </button>

                  {/* Waveform Bar Graphic */}
                  <div className="h-10 flex-1 flex items-center gap-1 px-2 overflow-hidden">
                    {[40, 65, 30, 80, 95, 50, 70, 45, 90, 60, 35, 75, 55, 85, 40, 70, 90, 65, 30, 80, 50, 40, 70, 90, 60].map((h, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 rounded-full transition-all ${
                          isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1 shrink-0">
                    <Volume2 className="w-4 h-4" />
                    Audio Preview
                  </div>
                </div>
              </div>
            )}

            {/* Primary CTA Button */}
            <button
              onClick={handleAnalyzeClick}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-cyan-200" />
              Analyze Voice
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
