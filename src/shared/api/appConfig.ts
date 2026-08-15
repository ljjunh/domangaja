import DeviceInfo from 'react-native-device-info';
import { IS_IOS } from '@/shared/constants/platform';
import { isVersionBelow } from '@/shared/utils/compareVersion';

interface MaintenanceConfig {
  active: boolean;
  // 점검 종료 예정 시각 (ISO)
  until: string | null;
}

interface PlatformConfig {
  minSupportedVersion: string;
}

export interface AppConfigResponse {
  maintenance: MaintenanceConfig;
  // iOS 심사 지연으로 플랫폼별 최소 버전이 갈릴 수 있어 나눠서 받는다
  ios: PlatformConfig;
  android: PlatformConfig;
}

export interface AppStatus {
  isUnderMaintenance: boolean;
  maintenanceUntil: string | null;
  isUpdateRequired: boolean;
}

// TODO: 서버 준비되면 apiClient.get('/app/config', { timeout: 3000 })로 교체
// (스플래시를 붙잡는 요청이라 전역 10초 대신 3초로 끊는다)
const MOCK_APP_CONFIG: AppConfigResponse = {
  maintenance: { active: false, until: null },
  // maintenance: {
  //   active: true,
  //   // 오늘 오후 6시 → "오늘 오후 6:00"
  //   until: (() => {
  //     const d = new Date();
  //     d.setHours(18, 0, 0, 0);
  //     return d.toISOString();
  //   })(),
  // },
  ios: { minSupportedVersion: '1.0' },
  android: { minSupportedVersion: '1.0' },
};

export const fetchAppStatus = async (): Promise<AppStatus> => {
  const config = MOCK_APP_CONFIG;
  const { minSupportedVersion } = IS_IOS ? config.ios : config.android;

  return {
    isUnderMaintenance: config.maintenance.active,
    maintenanceUntil: config.maintenance.until,
    isUpdateRequired: isVersionBelow(DeviceInfo.getVersion(), minSupportedVersion),
  };
};
