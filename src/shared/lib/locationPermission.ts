import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
  request,
  type PermissionStatus,
} from 'react-native-permissions';
import { IS_IOS } from '@/shared/constants/platform';

/**
 * granted: 위치를 가져올 수 있음
 * retriable: 거절했지만 팝업 기회가 남음
 * blocked: 팝업 기회 소진 — 설정에서만 바꿀 수 있음
 */
export type LocationPermissionResult = 'granted' | 'retriable' | 'blocked';

function toResult(status: PermissionStatus): LocationPermissionResult {
  if (status === RESULTS.GRANTED) {
    return 'granted';
  }
  if (status === RESULTS.DENIED) {
    return 'retriable';
  }
  return 'blocked';
}

// 안드로이드는 정확한 위치(FINE)와 대략적인 위치(COARSE)가 별도 권한이다 —
// 좌표는 대략적인 위치만으로도 얻을 수 있으므로 둘 중 하나만 허용돼도 granted로 본다
function toAndroidResult(
  fineStatus: PermissionStatus,
  coarseStatus: PermissionStatus,
): LocationPermissionResult {
  if (fineStatus === RESULTS.GRANTED || coarseStatus === RESULTS.GRANTED) {
    return 'granted';
  }
  if (fineStatus === RESULTS.DENIED) {
    return 'retriable';
  }
  return 'blocked';
}

export const requestLocationPermission = async (): Promise<LocationPermissionResult> => {
  if (IS_IOS) {
    const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return toResult(status);
  }

  // FINE을 요청하면 OS가 정확/대략 위치 선택 다이얼로그를 띄운다(매니페스트에 COARSE도 선언돼 있어야 함) —
  // 사용자가 "대략적 위치"만 허용하면 FINE은 거부되고 COARSE만 허용된 상태가 된다
  const fineStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  const coarseStatus = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
  return toAndroidResult(fineStatus, coarseStatus);
};

// 팝업을 띄우지 않고 현재 상태만 읽는다 — 작성 화면 진입 후 재검증용
export const checkLocationPermission = async (): Promise<LocationPermissionResult> => {
  if (IS_IOS) {
    const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return toResult(status);
  }

  const fineStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  const coarseStatus = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
  return toAndroidResult(fineStatus, coarseStatus);
};

export const openLocationSettings = (): Promise<void> => openSettings();
