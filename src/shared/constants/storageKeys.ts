export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  LANGUAGE: 'language',
  // 지도에서 마지막으로 보던 영역 — 재방문 시 그 자리에서 시작한다
  LAST_MAP_REGION: 'lastMapRegion',
} as const;
