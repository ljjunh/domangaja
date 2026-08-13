import { apiClient } from '@/shared/api/client';
import { GetTodaySpotResponse } from '@/domains/spot/types/api';

//  HTTP 호출 (axios) React를 모르는 순수 TS
export const getTodaySpot = async (): Promise<GetTodaySpotResponse> => {
  const { data } = await apiClient.get<GetTodaySpotResponse>('/spots/today');
  console.log('todayspot', data);
  return data;
};
