export interface CreateStoryRequest {
  regionName: string;
  spotName: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
}

export interface CreateStoryResponse {
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
