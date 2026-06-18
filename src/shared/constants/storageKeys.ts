export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;
