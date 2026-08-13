import { apiClient } from '@/shared/api/client';
import type {
  GetTodaySpotResponse,
  GetPopularSpotsRequest,
  GetPopularSpotsResponse,
  GetWeeklyThemesRequest,
  GetWeeklyThemesResponse,
  GetRecentSpotsRequest,
  GetRecentSpotsResponse,
} from '@/domains/spot/types/api';

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
