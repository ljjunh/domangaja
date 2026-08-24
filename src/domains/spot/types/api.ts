// DTO (서버 계약: Request/Response)
import type { SpotTheme, TourismSpotTheme } from '@/shared/types/spotTheme';
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
  // KTO 혼잡도 측정 대상이 아니면 null
  quietnessScore: number | null;
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

export interface GetThemeSpotsRequest {
  theme: TourismSpotTheme;
  // default 20 (max 100). API has no pagination.
  limit?: number;
}

export interface ThemeSpot {
  contentId: string;
  contentTypeId: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceMeters: number | null;
  imageUrl: string;
  tel: string;
  quietnessScore: number | null;
  areaCode: string;
  sigunguCode: string;
  regionName: string;
  theme: SpotTheme;
}

export type GetThemeSpotsResponse = ThemeSpot[];

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
  // KTO 혼잡도 측정 대상이 아니면 null
  quietnessScore: number | null;
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
  // KTO 혼잡도 측정 대상이 아니면 null
  quietnessScore: number | null;
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
  scrapped: boolean;
  scrapId: number | null;
}

export interface CreateScrapRequest {
  contentId: string;
  // default: SPOT
  type?: ScrapType;
  title?: string;
  regionName?: string;
  imageUrl?: string;
  quietnessScore?: number;
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
  quietnessScore: number | null;
  areaCode: string;
  sigunguCode: string;
}

export type GetMapSpotsResponse = MapSpot[];

export interface GetAreaSpotsParams {
  areaCode: string;
  sigunguCode?: string;
  contentTypeId?: number;
  lang?: ServerLocale;
}

export interface GetAreaSpotsRequest extends GetAreaSpotsParams {
  // default 10
  numOfRows?: number;
  // default 1
  pageNo?: number;
}

export interface AreaSpot {
  contentId: string;
  contentTypeId: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  // 지역 검색은 위치 기준이 없어서 항상 null
  distanceMeters: null;
  imageUrl: string;
  tel: string;
  quietnessScore: number | null;
  areaCode: string;
  sigunguCode: string;
}

export type GetAreaSpotsResponse = AreaSpot[];

export interface GetCongestionRequest {
  areaCode: string;
  sigunguCode: string;
  touristSpot: string;
  year: number;
  month: number;
}

export interface DailyQuietness {
  date: string;
  quietnessScore: number;
}

export interface CongestionSpot {
  touristSpotName: string;
  daily: DailyQuietness[];
}

export interface GetCongestionResponse {
  areaCode: string;
  areaName: string;
  sigunguCode: string;
  sigunguName: string;
  availableFrom: string;
  availableTo: string;
  spots: CongestionSpot[];
}
