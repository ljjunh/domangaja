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

export type IllustratedSpotTheme = Exclude<SpotTheme, 'ETC'>;
export type TourismSpotTheme = Exclude<SpotTheme, 'NIGHT_SKY' | 'ETC'>;

export const ONBOARDING_SPOT_THEMES: IllustratedSpotTheme[] = [
  'SEA',
  'MOUNTAIN',
  'ISLAND',
  'FIELD',
  'NIGHT_SKY',
  'VALLEY',
  'CITY',
];

/** KTO 관광지 테마 목록 API가 실제로 지원하는 테마 6종. */
export const TOURISM_SPOT_THEMES: TourismSpotTheme[] = [
  'SEA',
  'MOUNTAIN',
  'ISLAND',
  'FIELD',
  'VALLEY',
  'CITY',
];
