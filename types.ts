
export enum AppStep {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  RESULT = 'RESULT'
}

export interface FileData {
  data: string; // base64
  mimeType: string;
  name: string;
}

export interface AnalysisParams {
  groupProfile: string;
  groupFile?: FileData;
  commissionProfile: string;
  commissionFile?: FileData;
  model: string;
  temperature: number;
}

export interface AnalysisResponse {
  rawText: string;
}
