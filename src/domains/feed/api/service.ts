import { apiClient } from '@/shared/api/client';
import type { CreateStoryRequest, CreateStoryResponse } from '@/domains/feed/types/api';

export const createStory = async (params: CreateStoryRequest): Promise<CreateStoryResponse> => {
  const { data } = await apiClient.post<CreateStoryResponse>('/community/stories', params);
  return data;
};
