
export enum PitchStyle {
  STARTUP = 'Startup pitch',
  GAME_TRAILER = 'Game trailer',
  SCIENTIFIC = 'Scientific explainer',
  CRAZY_HYPE = 'Crazy hype'
}

export interface PitchData {
  idea: string;
  style: PitchStyle;
}

export interface GeneratedResult {
  script: string;
  audioBlob?: Blob;
}
