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
