import { apiClient } from '@/shared/api/client';
import type {
  CreateStoryRequest,
  CreateStoryResponse,
  GetStoriesRequest,
  GetStoriesResponse,
} from '@/domains/feed/types/api';

export const createStory = async (params: CreateStoryRequest): Promise<CreateStoryResponse> => {
  const { data } = await apiClient.post<CreateStoryResponse>('/community/stories', params);
  return data;
};

export const getStories = async (params: GetStoriesRequest): Promise<GetStoriesResponse> => {
  const { data } = await apiClient.get<GetStoriesResponse>('/community/stories', { params });
  return data;
};
