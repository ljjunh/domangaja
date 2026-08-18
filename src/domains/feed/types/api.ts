export interface CreateStoryRequest {
  regionName: string;
  spotName: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
}

export interface Story {
  id: number;
  userId: number;
  authorNickname: string;
  regionName: string;
  spotName: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  quietnessScore: number | null;
  viewCount: number;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
}

export type CreateStoryResponse = Story;

export interface GetStoriesRequest {
  page: number;
  size: number;
  sort?: string[];
}

export interface GetStoriesResponse {
  content: Story[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface StoryLikeResponse {
  active: boolean;
  count: number;
}

export interface CreateFeedRequest {
  category?: string;
  regionName: string;
  spotName: string;
  latitude: number;
  longitude: number;
  title: string;
  content: string;
  imageUrl: string;
  quietnessScore?: number;
}

export interface Feed {
  id: number;
  userId: number;
  authorNickname: string;
  category: string;
  regionName: string;
  spotName: string;
  latitude: number;
  longitude: number;
  title: string;
  content: string;
  imageUrl: string;
  quietnessScore: number | null;
  viewCount: number;
  commentCount: number;
  bookmarkCount: number;
  bookmarkedByMe: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateFeedResponse = Feed;

export type ReportTargetType = 'STORY';

export interface CreateReportRequest {
  targetType: ReportTargetType;
  targetId: number;
  reason: string;
}

export interface CreateReportResponse {
  id: number;
  targetType: ReportTargetType;
  targetId: number;
}
