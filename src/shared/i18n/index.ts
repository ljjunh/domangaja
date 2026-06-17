import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import ko from './locales/ko.json';
import en from './locales/en.json';

const deviceLanguage = getLocales()[0]?.languageCode ?? 'ko';

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
  },
  lng: deviceLanguage, // 기기 언어로 시작
  fallbackLng: 'ko', // 없는 키/언어는 한국어로
  supportedLngs: ['ko', 'en'],
  interpolation: { escapeValue: false }, // RN은 XSS 없음
});

export default i18n;
