import DeviceInfo from 'react-native-device-info';
import { apiClient } from '@/shared/api/client';
import { IS_IOS } from '@/shared/constants/platform';
import { isVersionBelow } from '@/shared/utils/compareVersion';

interface MaintenanceConfig {
  active: boolean;
  until: string | null;
}

interface PlatformConfig {
  minSupportedVersion: string;
}

export interface AppConfigResponse {
  maintenance: MaintenanceConfig;
  ios: PlatformConfig;
  android: PlatformConfig;
}

export interface AppStatus {
  isUnderMaintenance: boolean;
  maintenanceUntil: string | null;
  isUpdateRequired: boolean;
}

const CONFIG_TIMEOUT = 3_000;

export const fetchAppStatus = async (): Promise<AppStatus> => {
  const { data: config } = await apiClient.get<AppConfigResponse>('/app/config', {
    timeout: CONFIG_TIMEOUT,
  });
  const { minSupportedVersion } = IS_IOS ? config.ios : config.android;

  return {
    isUnderMaintenance: config.maintenance.active,
    maintenanceUntil: config.maintenance.until ?? null,
    isUpdateRequired: isVersionBelow(DeviceInfo.getVersion(), minSupportedVersion),
  };
};
