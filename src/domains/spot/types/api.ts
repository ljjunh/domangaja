// DTO (서버 계약: Request/Response)
import type { SpotTheme } from '@/shared/types/spotTheme';
import type { ServerLocale } from '@/shared/i18n/serverLocale';
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
  // default 7 (1~90)
  days?: number;
  // default 10 (1~50)
  limit?: number;
  page?: number;
}

export interface PopularSpot {
  rank: number;
  contentId: string;
  title: string;
  regionName: string;
  imageUrl: string;
  quietnessScore: number;
  theme: SpotTheme;
  viewCount: number;
  scrapped: boolean;
  scrapId: number | null;
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
  // default 10 (1~50)
  limit?: number;
  // default 0. 받은 개수가 limit보다 작으면 마지막 페이지
  page?: number;
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

// 지도 카메라의 region 값을 그대로 보낸다 (react-native-maps의 Region과 같은 모양)
export interface GetMapSpotsRequest {
  lat: number;
  lng: number;
  // 화면에 보이는 위/경도의 전체 폭. 경계는 중심 ± delta / 2
  latitudeDelta: number;
  longitudeDelta: number;
  contentTypeId?: number;
  lang?: ServerLocale;
}

export interface MapSpot {
  contentId: string;
  contentTypeId: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  imageUrl: string;
  tel: string;
  quietnessScore: number;
}

export type GetMapSpotsResponse = MapSpot[];
