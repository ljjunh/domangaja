import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/shared/constants/storageKeys';
import { LANGUAGES, type LanguageCode } from './languages';
import ko from './locales/ko.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import zhHans from './locales/zh-Hans.json';
import zhHant from './locales/zh-Hant.json';

function resolveDeviceLanguage(): LanguageCode {
  const locale = getLocales()[0];
  if (!locale) {
    return 'ko';
  }
  if (locale.languageCode === 'zh') {
    return locale.scriptCode === 'Hant' ? 'zh-Hant' : 'zh-Hans';
  }
  const supported = LANGUAGES.find(language => language.code === locale.languageCode);
  return supported?.code ?? 'ko';
}

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
    ja: { translation: ja },
    'zh-Hans': { translation: zhHans },
    'zh-Hant': { translation: zhHant },
  },
  lng: resolveDeviceLanguage(), // 기기 언어로 시작
  fallbackLng: 'ko', // 없는 키/언어는 한국어로
  supportedLngs: LANGUAGES.map(language => language.code),
  interpolation: { escapeValue: false }, // RN은 XSS 없음
});

// 앱 시작 시 저장된 언어 복원
export async function restoreLanguage() {
  const saved = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
  if (saved && saved !== i18n.language) {
    await i18n.changeLanguage(saved);
  }
}

// 언어 변경 + 저장
export async function changeAppLanguages(code: LanguageCode) {
  await i18n.changeLanguage(code);
  await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, code);
}

export default i18n;
