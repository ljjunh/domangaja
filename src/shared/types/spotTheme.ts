/**
 * 장소 테마 — 서버 enum 8종.
 * 피드 카테고리 · 온보딩 관심 풍경 · 홈 인기 테마가 같은 enum을 쓰므로
 * 특정 도메인의 소유가 아니라 앱 전체가 공유하는 shared
 */
export type SpotTheme =
  | 'SEA'
  | 'MOUNTAIN'
  | 'ISLAND'
  | 'FIELD'
  | 'NIGHT_SKY'
  | 'VALLEY'
  | 'CITY'
  | 'ETC';

export const SPOT_THEMES: SpotTheme[] = [
  'SEA',
  'MOUNTAIN',
  'ISLAND',
  'FIELD',
  'NIGHT_SKY',
  'VALLEY',
  'CITY',
  'ETC',
];

// 온보딩 노출은 ETC(기타) 제외 7종 — "어떤 풍경을 좋아하세요?"에 기타는 고를 이유가 없다
export type OnboardingSpotTheme = Exclude<SpotTheme, 'ETC'>;

export const ONBOARDING_SPOT_THEMES: OnboardingSpotTheme[] = [
  'SEA',
  'MOUNTAIN',
  'ISLAND',
  'FIELD',
  'NIGHT_SKY',
  'VALLEY',
  'CITY',
];
