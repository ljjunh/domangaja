import { apiClient } from '@/shared/api/client';
import type {
  CreateFeedRequest,
  CreateFeedResponse,
  CreateReportRequest,
  CreateReportResponse,
  CreateStoryRequest,
  CreateStoryResponse,
  GetStoriesRequest,
  GetStoriesResponse,
  Story,
  StoryLikeResponse,
} from '@/domains/feed/types/api';

export const createFeed = async (params: CreateFeedRequest): Promise<CreateFeedResponse> => {
  const { data } = await apiClient.post<CreateFeedResponse>('/community/feeds', params);
  return data;
};

export const createStory = async (params: CreateStoryRequest): Promise<CreateStoryResponse> => {
  const { data } = await apiClient.post<CreateStoryResponse>('/community/stories', params);
  return data;
};

export const getStories = async (params: GetStoriesRequest): Promise<GetStoriesResponse> => {
  const { data } = await apiClient.get<GetStoriesResponse>('/community/stories', { params });
  return data;
};

export const getStory = async (storyId: number): Promise<Story> => {
  const { data } = await apiClient.get<Story>(`/community/stories/${storyId}`);
  return data;
};

export const deleteStory = async (storyId: number): Promise<void> => {
  await apiClient.delete(`/community/stories/${storyId}`);
};

export const likeStory = async (storyId: number): Promise<StoryLikeResponse> => {
  const { data } = await apiClient.post<StoryLikeResponse>(`/community/stories/${storyId}/likes`);
  return data;
};

export const unlikeStory = async (storyId: number): Promise<StoryLikeResponse> => {
  const { data } = await apiClient.delete<StoryLikeResponse>(`/community/stories/${storyId}/likes`);
  return data;
};

export const reportStory = async (
  storyId: number,
  reason: string,
): Promise<CreateReportResponse> => {
  const params: CreateReportRequest = { targetType: 'STORY', targetId: storyId, reason };
  const { data } = await apiClient.post<CreateReportResponse>('/community/reports', params);
  return data;
};
