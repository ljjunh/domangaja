import { apiClient } from '@/shared/api/client';
import type {
  CommentLikeResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  CreateFeedRequest,
  CreateFeedResponse,
  CreateReportRequest,
  CreateReportResponse,
  CreateStoryRequest,
  CreateStoryResponse,
  Feed,
  FeedBookmarkResponse,
  GetCommentsResponse,
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

export const getComments = async (feedId: number): Promise<GetCommentsResponse> => {
  const { data } = await apiClient.get<GetCommentsResponse>(`/community/feeds/${feedId}/comments`);
  return data;
};

export const createComment = async (
  feedId: number,
  params: CreateCommentRequest,
): Promise<CreateCommentResponse> => {
  const { data } = await apiClient.post<CreateCommentResponse>(
    `/community/feeds/${feedId}/comments`,
    params,
  );
  return data;
};

export const deleteComment = async (feedId: number, commentId: number): Promise<void> => {
  await apiClient.delete(`/community/feeds/${feedId}/comments/${commentId}`);
};

export const reportComment = async (
  commentId: number,
  reason: string,
): Promise<CreateReportResponse> =>
  createReport({ targetType: 'COMMENT', targetId: commentId, reason });

export const likeComment = async (
  feedId: number,
  commentId: number,
): Promise<CommentLikeResponse> => {
  const { data } = await apiClient.post<CommentLikeResponse>(
    `/community/feeds/${feedId}/comments/${commentId}/likes`,
  );
  return data;
};

export const unlikeComment = async (
  feedId: number,
  commentId: number,
): Promise<CommentLikeResponse> => {
  const { data } = await apiClient.delete<CommentLikeResponse>(
    `/community/feeds/${feedId}/comments/${commentId}/likes`,
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
