export const LANGUAGES = [
  { code: 'ko', nativeName: '한국어' },
  { code: 'zh-Hans', nativeName: '中文(简体)' },
  { code: 'zh-Hant', nativeName: '中文(繁體)' },
  { code: 'ja', nativeName: '日本語' },
  { code: 'en', nativeName: 'English' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

// 언어 코드 → 그 언어의 자기 이름 (예: 'ko' → '한국어')
export function getLanguageNativeName(code: string): string | undefined {
  return LANGUAGES.find(language => language.code === code)?.nativeName;
}
