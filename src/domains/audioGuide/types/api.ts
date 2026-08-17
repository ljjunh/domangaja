export interface GetNearbyAudioGuidesRequest {
  lat: number;
  lng: number;
  radius?: number;
  langCode?: string;
  numOfRows?: number;
  pageNo?: number;
}

// TODO: nullable 필드 확인 필요
export interface AudioGuide {
  title: string;
  audioTitle: string | null;
  script: string | null;
  playTimeSeconds: number | null;
  audioUrl: string | null;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  langCode: string;
}

export type PlayableAudioGuide = AudioGuide & { audioUrl: string };

export type GetNearbyAudioGuidesResponse = AudioGuide[];
