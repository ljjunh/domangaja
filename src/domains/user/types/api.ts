import type { NotificationSettings } from '@/domains/notification/types/api';
import type { SpotTheme } from '@/shared/types/spotTheme';

// 서버 enum — 선호 지역 6종
export type PreferredRegion =
  | 'SEOUL'
  | 'GANGWON'
  | 'CHUNGCHEONG'
  | 'JEOLLA'
  | 'GYEONGSANG'
  | 'JEJU';

export interface CompleteOnboardingRequest {
  nickname: string;
  birthDate: string;
  preferredRegions: PreferredRegion[];
  preferredCategories: SpotTheme[];
}

export interface CompleteOnboardingResponse {
  id: number;
  nickname: string;
  email: string | null;
  role: string;
  signupCompleted: boolean;
  preferredCategories: SpotTheme[];
  preferredRegions: PreferredRegion[];
  birthDate: string | null;
  locale: string;
  profileImageUrl: string | null;
  notificationSettings: NotificationSettings;
}

export interface GetMeResponse {
  id: number;
  nickname: string;
  email: string | null;
  role: string;
  signupCompleted: boolean;
  preferredCategories: SpotTheme[];
  preferredRegions: PreferredRegion[];
  birthDate: string | null;
  locale: string;
  profileImageUrl: string | null;
  notificationSettings: NotificationSettings;
}

export interface UpdateProfileRequest {
  nickname?: string;
  birthDate?: string;
  preferredRegions?: PreferredRegion[];
  preferredCategories?: SpotTheme[];
  profileImageUrl?: string;
}

export type NicknameUnavailableReason = 'LENGTH' | 'FORMAT' | 'DUPLICATE';

export interface NicknameAvailabilityResponse {
  nickname: string;
  available: boolean;
  reason: NicknameUnavailableReason | null;
  message: string;
}
