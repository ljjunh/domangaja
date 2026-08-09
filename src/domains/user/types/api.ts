export interface UpdateMyProfileRequest {
  preferredCategories: string[];
}

export interface UpdateMyProfileResponse {
  id: number;
  nickname: string;
  email: string;
  role: string;
  signupCompleted: boolean;
  preferredCategories: string[];
}

export interface GetMeResponse {
  id: number;
  nickname: string;
  email: string;
  role: string;
  signupCompleted: boolean;
  preferredCategories: string[];
}
