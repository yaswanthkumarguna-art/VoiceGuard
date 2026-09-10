export type ClassificationType = 'human' | 'potentially_ai_generated' | 'uncertain';

export type RiskLevel = 'low' | 'medium' | 'high' | 'uncertain';

export type PromotionalCallIntent = 'telemarketing' | 'robocall' | 'financial_scam' | 'automated_survey' | 'organic_call';

export interface MobileCallMetadata {
  caller_number: string;
  caller_name?: string;
  call_direction: 'incoming' | 'outgoing';
  call_end_timestamp: string;
  duration_seconds: number;
  auto_uploaded: boolean;
  carrier?: string;
}

export interface DetectionSignals {
  spectral_anomaly: number; // 0 to 1
  prosody_anomaly: number;  // 0 to 1
  synthetic_artifact_score: number; // 0 to 1
  speech_embedding_score: number;   // 0 to 1
  promotional_cadence_score?: number; // 0 to 1
}

export interface VoiceAnalysisResult {
  id: string;
  timestamp: string;
  file_name: string;
  file_size: string;
  audio_duration: number; // in seconds
  analysis_time: number;  // in seconds
  classification: ClassificationType;
  ai_probability: number;  // 0 to 1 (e.g. 0.91)
  human_probability: number; // 0 to 1 (e.g. 0.09)
  risk_level: RiskLevel;
  signals: DetectionSignals;
  explanation: string;
  is_demo?: boolean;
  // Promotional & Robocall Detection Fields
  is_promotional_call?: boolean;
  promotional_score?: number; // 0 to 1
  promotional_intent?: PromotionalCallIntent;
  // Automatic Post-Call Upload Fields
  is_auto_uploaded_call?: boolean;
  call_metadata?: MobileCallMetadata;
}

export interface DashboardMetrics {
  total_analyses: number;
  potential_ai_count: number;
  authentic_count: number;
  uncertain_count: number;
  promotional_call_count: number;
  auto_uploaded_call_count: number;
  demo_accuracy: string;
}

export type ViewState = 'landing' | 'dashboard' | 'analyze' | 'animating' | 'result' | 'history' | 'how-it-works';
