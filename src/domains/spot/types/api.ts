// DTO (서버 계약: Request/Response)

export type SpotTheme =
  | 'SEA'
  | 'MOUNTAIN'
  | 'ISLAND'
  | 'FIELD'
  | 'NIGHT_SKY'
  | 'WATER'
  | 'CITY'
  | 'ETC';
export interface GetTodaySpotResponse {
  contentId: string;
  title: string;
  regionName: string;
  imageUrl: string;
  quietnessScore: number;
  theme: SpotTheme;
  viewedAt: string;
  description: string;
}
