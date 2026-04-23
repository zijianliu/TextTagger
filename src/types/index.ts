export interface ClassificationResult {
  text: string;
  category: string;
  confidence: number;
  timestamp: string;
}

export interface BatchClassificationRequest {
  texts: string[];
}

export interface BatchClassificationResponse {
  results: ClassificationResult[];
}

export interface HistoryFilter {
  category?: string;
}

export type Category = '产品反馈' | '问题投诉' | '功能建议' | '其他';