import { Platform } from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  openSettings,
  request,
  type Permission,
} from 'react-native-permissions';
import { IS_IOS } from '@/shared/constants/platform';

// Android 13(API 33)부터 저장소 권한이 미디어 타입별로 쪼개짐
const ANDROID_MEDIA_PERMISSION_SDK = 33;

function resolvePhotoPermission(): Permission {
  if (IS_IOS) {
    return PERMISSIONS.IOS.PHOTO_LIBRARY;
  }
  return Number(Platform.Version) >= ANDROID_MEDIA_PERMISSION_SDK
    ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
}

/**
 * granted: 사진첩을 열 수 있음(limited 포함)
 * retriable: 거절했지만 팝업 기회가 남음 — 안드로이드는 2회까지 물어본다
 * blocked: 팝업 기회 소진 — 설정에서만 바꿀 수 있다(iOS는 1회 거절부터 여기)
 */
export type PhotoPermissionResult = 'granted' | 'retriable' | 'blocked';

export const requestPhotoPermission = async (): Promise<PhotoPermissionResult> => {
  const status = await request(resolvePhotoPermission());

  if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
    return 'granted';
  }
  // DENIED는 "아직 안 물어봤거나 다시 물어볼 수 있음"이라 설정으로 보낼 단계가 아니다
  if (status === RESULTS.DENIED) {
    return 'retriable';
  }
  return 'blocked';
};

export const openPhotoSettings = (): Promise<void> => openSettings();
