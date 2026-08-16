// DTO (서버 계약: Request/Response)
import type { SpotTheme } from '@/shared/types/spotTheme';
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

export interface GetPopularSpotsRequest {
  // default 7
  days?: number;
  // default 10
  limit?: number;
}

export interface PopularSpot {
  rank: number;
  contentId: string;
  title: string;
  regionName: string;
  imageUrl: string;
  quietnessScore: number;
  viewCount: number;
}

export type GetPopularSpotsResponse = PopularSpot[];

export interface GetWeeklyThemesRequest {
  // default 7
  days?: number;
  // default 10
  limit?: number;
}

export interface WeeklyTheme {
  theme: SpotTheme;
  label: string;
  spotCount: number;
  viewCount: number;
  imageUrl: string;
}

export type GetWeeklyThemesResponse = WeeklyTheme[];

export interface GetRecentSpotsRequest {
  // default 10
  limit?: number;
}

export interface RecentSpot {
  contentId: string;
  title: string;
  regionName: string;
  imageUrl: string;
  quietnessScore: number;
  theme: SpotTheme;
  viewedAt: string;
  description: string;
  scrapped: boolean;
  scrapId: number;
}

export type GetRecentSpotsResponse = RecentSpot[];

export type ScrapType = 'SPOT' | 'COURSE';
export interface GetScrapsRequest {
  type: ScrapType;
}
export interface Scrap {
  id: number;
  contentId: string;
  // default: SPOT
  type?: ScrapType;
  title: string;
  regionName: string;
  imageUrl: string;
  quietnessScore: number;
}

export type GetScrapsResponse = Scrap[];

export interface CreateScrapRequest {
  contentId: string;
  // default: SPOT
  type?: ScrapType;
  title?: string;
  regionName: string;
  imageUrl: string;
  quietnessScore: number;
}

export type CreateScrapResponse = Scrap;

export interface DeleteScrapRequest {
  contentId: string;
  // default: SPOT
  type?: ScrapType;
}

export interface CreateSpotViewRequest {
  contentId: string;
  title: string;
  regionName?: string;
  imageUrl?: string;
  quietnessScore?: number;
  theme?: SpotTheme;
}

export interface CreateSpotViewResponse {
  contentId: string;
  title: string;
  regionName: string;
  imageUrl: string;
  quietnessScore: number;
  theme: SpotTheme;
  viewedAt: string;
  description: string;
  scrapped: boolean;
  scrapId: number | null;
}
