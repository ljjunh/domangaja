import { apiClient } from '@/shared/api/client';
import type {
  CreateFeedRequest,
  CreateFeedResponse,
  CreateReportRequest,
  CreateReportResponse,
  CreateStoryRequest,
  CreateStoryResponse,
  Feed,
  FeedBookmarkResponse,
  GetFeedsRequest,
  GetFeedsResponse,
  GetStoriesRequest,
  GetStoriesResponse,
  Story,
  StoryLikeResponse,
} from '@/domains/feed/types/api';

// STORY/FEED(추후 COMMENT 등) 공용 신고 API — targetType만 다르게 넘겨 재사용한다
export const createReport = async (params: CreateReportRequest): Promise<CreateReportResponse> => {
  const { data } = await apiClient.post<CreateReportResponse>('/community/reports', params);
  return data;
};

export const createFeed = async (params: CreateFeedRequest): Promise<CreateFeedResponse> => {
  const { data } = await apiClient.post<CreateFeedResponse>('/community/feeds', params);
  return data;
};

export const getFeeds = async (params: GetFeedsRequest): Promise<GetFeedsResponse> => {
  const { data } = await apiClient.get<GetFeedsResponse>('/community/feeds', { params });
  return data;
};

export const getFeed = async (feedId: number): Promise<Feed> => {
  const { data } = await apiClient.get<Feed>(`/community/feeds/${feedId}`);
  return data;
};

export const deleteFeed = async (feedId: number): Promise<void> => {
  await apiClient.delete(`/community/feeds/${feedId}`);
};

export const reportFeed = async (feedId: number, reason: string): Promise<CreateReportResponse> =>
  createReport({ targetType: 'FEED', targetId: feedId, reason });

export const bookmarkFeed = async (feedId: number): Promise<FeedBookmarkResponse> => {
  const { data } = await apiClient.post<FeedBookmarkResponse>(
    `/community/feeds/${feedId}/bookmark`,
  );
  return data;
};

export const unbookmarkFeed = async (feedId: number): Promise<FeedBookmarkResponse> => {
  const { data } = await apiClient.delete<FeedBookmarkResponse>(
    `/community/feeds/${feedId}/bookmark`,
  );
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

export const reportStory = async (storyId: number, reason: string): Promise<CreateReportResponse> =>
  createReport({ targetType: 'STORY', targetId: storyId, reason });
