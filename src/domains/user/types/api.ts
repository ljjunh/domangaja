import type { NotificationSettings } from '@/domains/notification/types/api';

// 서버 enum — 선호 지역 6종
export type PreferredRegion =
  | 'SEOUL'
  | 'GANGWON'
  | 'CHUNGCHEONG'
  | 'JEOLLA'
  | 'GYEONGSANG'
  | 'JEJU';

// 서버 enum — 선호 카테고리 8종 (온보딩 화면엔 CITY, ETC 제외 6종만 노출)
export type PreferredCategory =
  | 'SEA'
  | 'MOUNTAIN'
  | 'ISLAND'
  | 'FIELD'
  | 'NIGHT_SKY'
  | 'WATER'
  | 'CITY'
  | 'ETC';

export interface CompleteOnboardingRequest {
  nickname: string;
  birthDate: string;
  preferredRegions: PreferredRegion[];
  preferredCategories: PreferredCategory[];
}

export interface CompleteOnboardingResponse {
  id: number;
  nickname: string;
  email: string | null;
  role: string;
  signupCompleted: boolean;
  preferredCategories: PreferredCategory[];
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
  preferredCategories: PreferredCategory[];
  preferredRegions: PreferredRegion[];
  birthDate: string | null;
  locale: string;
  profileImageUrl: string | null;
  notificationSettings: NotificationSettings;
}

export type ServerLocale = 'KO' | 'EN' | 'JP' | 'ZH_CN' | 'ZH_TW';

export type NicknameUnavailableReason = 'LENGTH' | 'FORMAT' | 'DUPLICATE';

export interface NicknameAvailabilityResponse {
  nickname: string;
  available: boolean;
  reason: NicknameUnavailableReason | null;
  message: string;
}
