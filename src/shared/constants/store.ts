import { IS_IOS } from '@/shared/constants/platform';

// TODO: 스토어 주소나오면 교체
const APPLE_APP_ID = '';
const ANDROID_PACKAGE_NAME = 'com.domangaja';

export const STORE_SCHEME_URL = IS_IOS
  ? `itms-apps://apps.apple.com/app/id${APPLE_APP_ID}`
  : `market://details?id=${ANDROID_PACKAGE_NAME}`;

// 스토어 앱 없는 경우 웹으로 폴백
export const STORE_WEB_URL = IS_IOS
  ? `https://apps.apple.com/app/id${APPLE_APP_ID}`
  : `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`;
