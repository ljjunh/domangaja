import { apiClient } from '@/shared/api/client';
import {
  type GetTodaySpotResponse,
  type GetPopularSpotsRequest,
  type GetPopularSpotsResponse,
  type GetWeeklyThemesRequest,
  type GetWeeklyThemesResponse,
  type GetRecentSpotsRequest,
  type GetRecentSpotsResponse,
  type GetScrapsRequest,
  type GetScrapsResponse,
  type CreateScrapRequest,
  type CreateScrapResponse,
  type DeleteScrapRequest,
  type CreateSpotViewRequest,
  CreateSpotViewResponse,
  type GetMapSpotsRequest,
  type GetMapSpotsResponse,
  type GetCongestionRequest,
  type GetCongestionResponse,
} from '@/domains/spot/types/api';

export const getTodaySpot = async (): Promise<GetTodaySpotResponse> => {
  const { data } = await apiClient.get<GetTodaySpotResponse>('/spots/today');
  return data;
};

export const getMapSpots = async (params: GetMapSpotsRequest): Promise<GetMapSpotsResponse> => {
  const { data } = await apiClient.get<GetMapSpotsResponse>('/tourism/map', { params });
  console.log(data);
  return data;
};

export const getCongestion = async (
  params: GetCongestionRequest,
): Promise<GetCongestionResponse> => {
  const { data } = await apiClient.get<GetCongestionResponse>('/congestion', { params });
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

export const createScrap = async (params: CreateScrapRequest): Promise<CreateScrapResponse> => {
  const { data } = await apiClient.post<CreateScrapResponse>('/scraps', params);
  return data;
};

export const deleteScrap = async (params: DeleteScrapRequest): Promise<void> => {
  await apiClient.delete('/scraps', { params });
};

export const createSpotView = async (
  params: CreateSpotViewRequest,
): Promise<CreateSpotViewResponse> => {
  const { data } = await apiClient.post<CreateSpotViewResponse>('/spots/views', params);
  return data;
};
