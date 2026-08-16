import { apiClient } from '@/shared/api/client';
import type {
  GetTodaySpotResponse,
  GetPopularSpotsRequest,
  GetPopularSpotsResponse,
  GetWeeklyThemesRequest,
  GetWeeklyThemesResponse,
  GetRecentSpotsRequest,
  GetRecentSpotsResponse,
  GetScrapsRequest,
  GetScrapsResponse,
  GetSpotDetailResponse,
  CreateScrapRequest,
  CreateScrapResponse,
  Scrap,
} from '@/domains/spot/types/api';
// TODO: 서버 로케일 타입 전역 관리 검토하기
import type { ServerLocale } from '@/domains/user/types/api';

export const getTodaySpot = async (): Promise<GetTodaySpotResponse> => {
  const { data } = await apiClient.get<GetTodaySpotResponse>('/spots/today');
  return data;
};

export const getPopularSpots = async (
  params: GetPopularSpotsRequest,
): Promise<GetPopularSpotsResponse> => {
  const { data } = await apiClient.get<GetPopularSpotsResponse>('/spots/popular', { params });
  return data;
};

export const getWeeklyThemes = async (
  params: GetWeeklyThemesRequest,
): Promise<GetWeeklyThemesResponse> => {
  const { data } = await apiClient.get<GetWeeklyThemesResponse>('/spots/themes/popular', {
    params,
  });
  return data;
};

export const getRecentSpots = async (
  params: GetRecentSpotsRequest,
): Promise<GetRecentSpotsResponse> => {
  const { data } = await apiClient.get<GetRecentSpotsResponse>('/spots/recent', { params });
  return data;
};

export const getScraps = async (params: GetScrapsRequest): Promise<GetScrapsResponse> => {
  const { data } = await apiClient.get<GetScrapsResponse>('/scraps', { params });
  return data;
};

export const getSpotDetail = async (
  contentId: string,
  lang: ServerLocale,
): Promise<GetSpotDetailResponse> => {
  const { data } = await apiClient.get<GetSpotDetailResponse>(`/tourism/${contentId}`, {
    params: { lang },
  });
  return data;
};

export const createScrap = async (params: CreateScrapRequest): Promise<CreateScrapResponse> => {
  const { data } = await apiClient.post<CreateScrapResponse>('/scraps', params);
  return data;
};

export const deleteScrap = async (id: Scrap['id']): Promise<void> => {
  await apiClient.delete(`/scraps/${id}`);
};
