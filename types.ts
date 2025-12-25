
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
  // Competències
  groupCompetencies: string;
  groupCompetenciesFile?: FileData;
  commissionCompetencies: string;
  commissionCompetenciesFile?: FileData;
  
  // Valors
  groupValues: string;
  groupValuesFile?: FileData;
  commissionValues: string;
  commissionValuesFile?: FileData;
  
  // Personalitat
  groupPersonality: string;
  groupPersonalityFile?: FileData;
  commissionPersonality: string;
  commissionPersonalityFile?: FileData;

  model: string;
  temperature: number;
}

export interface AnalysisResponse {
  rawText: string;
}
