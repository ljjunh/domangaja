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

export interface FeedBookmarkResponse {
  active: boolean;
  count: number;
}

export type FeedCategory =
  | 'SEA'
  | 'MOUNTAIN'
  | 'ISLAND'
  | 'FIELD'
  | 'NIGHT_SKY'
  | 'VALLEY'
  | 'CITY'
  | 'ETC';

export type FeedSort = 'LATEST' | 'VIEWS' | 'POPULAR';

export interface GetFeedsRequest {
  category?: FeedCategory;
  page?: number;
  size?: number;
  sort?: FeedSort;
}

export interface GetFeedsResponse {
  content: Feed[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface Comment {
  id: number;
  feedId: number;
  userId: number;
  authorNickname: string;
  content: string;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
}

export type GetCommentsResponse = Comment[];

export interface CreateCommentRequest {
  content: string;
}

export type CreateCommentResponse = Comment;

export interface CommentLikeResponse {
  active: boolean;
  count: number;
}

export type ReportTargetType = 'STORY' | 'FEED' | 'COMMENT';

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
