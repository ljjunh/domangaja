import type { LanguageCode } from '@/shared/i18n/languages';
import type { ServerLocale } from '@/domains/user/types/api';

// 서버가 일본어를 언어코드(ja)가 아닌 국가코드(JP)로, 중국어를 스크립트(Hans/Hant)가
// 아닌 지역(CN/TW)으로 표현해서 변환해야 함
const SERVER_LOCALE: Record<LanguageCode, ServerLocale> = {
  ko: 'KO',
  en: 'EN',
  ja: 'JP',
  'zh-Hans': 'ZH_CN',
  'zh-Hant': 'ZH_TW',
};

// i18n의 fallbackLng: 'ko'와 같은 정책 — 미지원 코드는 한국어로
export function toServerLocale(code: string): ServerLocale {
  return SERVER_LOCALE[code as LanguageCode] ?? 'KO';
}
