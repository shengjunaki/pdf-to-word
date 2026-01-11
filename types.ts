export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ConversionState {
  status: AppStatus;
  progress: number; // 0 to 100
  fileName: string | null;
  errorMessage: string | null;
}

export interface ExtractedPage {
  pageNumber: number;
  lines: string[];
}