// DTO (서버 계약: Request/Response)
import type { SpotTheme } from '@/shared/types/spotTheme';
// TODO: 서버 로케일 타입 전역 관리 검토하기
import type { ServerLocale } from '@/domains/user/types/api';

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

export interface GetSpotDetailRequest {
  contentId: string;
  lang: ServerLocale;
}

// TODO: nullable 필드 확인 필요
export interface GetSpotDetailResponse {
  contentId: string;
  contentTypeId: string;
  title: string;
  overview: string | null;
  homepage: string | null;
  tel: string | null;
  address: string | null;
  zipcode: string | null;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  thumbnailUrl: string | null;
}

export interface CreateScrapRequest {
  contentId: string;
  // default: SPOT
  type?: ScrapType;
  title: string;
}

export type CreateScrapResponse = Scrap;
