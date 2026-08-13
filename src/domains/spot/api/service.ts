import { apiClient } from '@/shared/api/client';
import type {
  GetTodaySpotResponse,
  GetPopularSpotsRequest,
  GetPopularSpotsResponse,
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
