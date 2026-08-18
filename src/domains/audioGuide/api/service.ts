import { apiClient } from '@/shared/api/client';
import type {
  GetNearbyAudioGuidesRequest,
  GetNearbyAudioGuidesResponse,
} from '@/domains/audioGuide/types/api';

export async function getNearbyAudioGuides(
  params: GetNearbyAudioGuidesRequest,
): Promise<GetNearbyAudioGuidesResponse> {
  const { data } = await apiClient.get<GetNearbyAudioGuidesResponse>('/audio-guides', { params });
  return data;
}
