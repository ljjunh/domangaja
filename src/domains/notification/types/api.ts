export interface NotificationSettings {
  congestionAlert: boolean;
  communityAlert: boolean;
  marketingAlert: boolean;
}

export type DevicePlatform = 'IOS' | 'ANDROID';

export interface RegisterDeviceTokenRequest {
  token: string;
  platform: DevicePlatform;
}
