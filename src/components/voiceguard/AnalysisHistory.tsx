import React, { useState } from 'react';
import { VoiceAnalysisResult, ViewState } from '../../types/voiceGuard';
import { History, Search, Trash2, ChevronRight, AlertTriangle, ShieldCheck, HelpCircle, Lock, Sparkles } from 'lucide-react';

interface AnalysisHistoryProps {
  history: VoiceAnalysisResult[];
  onSelectResult: (result: VoiceAnalysisResult) => void;
  onDeleteHistory: () => void;
  onNavigate: (view: ViewState) => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  history,
  onSelectResult,
  onDeleteHistory,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.classification === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0B0F19] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-white">Analysis History</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono">
              {history.length} Saved Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review past voice authenticity evaluations, probability scores, and signal metrics.
          </p>
        </div>

        <button
          onClick={() => onNavigate('analyze')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          New Analysis
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Filter:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Results</option>
            <option value="potentially_ai_generated">Potential AI Only</option>
            <option value="human">Likely Human Only</option>
            <option value="uncertain">Inconclusive Only</option>
          </select>
        </div>

      </div>

      {/* HISTORY DATA TABLE */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#070A12] text-[11px] font-mono uppercase text-slate-400">
                <th className="py-4 px-6 font-bold">Filename</th>
                <th className="py-4 px-4 font-bold">Date & Time</th>
                <th className="py-4 px-4 font-bold">Duration</th>
                <th className="py-4 px-4 font-bold">Classification</th>
                <th className="py-4 px-4 font-bold">AI Likelihood</th>
                <th className="py-4 px-4 font-bold">Risk Level</th>
                <th className="py-4 px-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                    No matching analysis records found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => {
                  const isAi = item.classification === 'potentially_ai_generated';
                  const isHuman = item.classification === 'human';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectResult(item)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isAi ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                            isHuman ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {isAi ? <AlertTriangle className="w-4 h-4" /> :
                             isHuman ? <ShieldCheck className="w-4 h-4" /> :
                             <HelpCircle className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                              {item.file_name}
                            </p>
                            <span className="text-[10px] text-slate-500 font-mono">{item.file_size}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="py-4 px-4 font-mono text-slate-300">
                        {item.audio_duration}s
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold font-mono uppercase ${
                          isAi ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          isHuman ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {isAi ? 'Potential AI' : isHuman ? 'Likely Human' : 'Inconclusive'}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold">
                        <span className={isAi ? 'text-rose-400' : isHuman ? 'text-emerald-400' : 'text-amber-400'}>
                          {Math.round(item.ai_probability * 100)}%
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono uppercase text-[11px] font-bold text-slate-300">
                        {item.risk_level}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <span className="text-cyan-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-mono text-[11px]">
                          View Detail
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRIVACY & DATA DELETION CONTROLS */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white font-poppins">Privacy & Biometric Data Retention</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Voice recordings can contain sensitive biometric information. A production version of VoiceGuard should process recordings securely, minimize retention, obtain appropriate user consent, and provide clear deletion controls.
            </p>
          </div>
        </div>

        {confirmDelete ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onDeleteHistory();
                setConfirmDelete(false);
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition-all"
            >
              Confirm Clear All Data
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-800 text-rose-400 font-semibold text-xs transition-all flex items-center gap-2 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            Delete Analysis Data
          </button>
        )}
      </div>

    </div>
  );
};
