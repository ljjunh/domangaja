import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
  type Permission,
} from 'react-native-permissions';
import { IS_IOS } from '@/shared/constants/platform';

function resolveLocationPermission(): Permission {
  return IS_IOS ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
}

/**
 * granted: 위치를 가져올 수 있음
 * retriable: 거절했지만 팝업 기회가 남음
 * blocked: 팝업 기회 소진 — 설정에서만 바꿀 수 있음
 */
export type LocationPermissionResult = 'granted' | 'retriable' | 'blocked';

export const requestLocationPermission = async (): Promise<LocationPermissionResult> => {
  const status = await request(resolveLocationPermission());

  if (status === RESULTS.GRANTED) {
    return 'granted';
  }

  if (status === RESULTS.DENIED) {
    return 'retriable';
  }
  return 'blocked';
};

// 팝업을 띄우지 않고 현재 상태만 읽는다 — 작성 화면 진입 후 재검증용
export const checkLocationPermission = async (): Promise<LocationPermissionResult> => {
  const status = await check(resolveLocationPermission());

  if (status === RESULTS.GRANTED) {
    return 'granted';
  }
  if (status === RESULTS.DENIED) {
    return 'retriable';
  }
  return 'blocked';
};

export const openLocationSettings = (): Promise<void> => openSettings();
