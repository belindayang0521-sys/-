export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RecommendationRequest {
  location: string;
  preference: string;
  budget: string;
  coords: Coordinates | null;
}

export interface RecommendationItem {
  name: string;
  snarky_comment: string;
  professional_recommendation: string;
  vibe_score: number;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets?: {
            content: string;
        }[]
    }
  };
}

export interface GeminiResponseData {
  text?: string;
  recommendations?: RecommendationItem[];
  groundingChunks?: GroundingChunk[];
}

export enum AppState {
  IDLE = 'IDLE',
  LOCATING = 'LOCATING',
  THINKING = 'THINKING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}