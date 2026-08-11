import { apiClient } from '@/shared/api/client';
import type {
  NotificationSettings,
  RegisterDeviceTokenRequest,
} from '@/domains/notification/types/api';

export const getNotificationSetting = async (): Promise<NotificationSettings> => {
  const { data } = await apiClient.get<NotificationSettings>('/notifications/settings');
  return data;
};

export const updateNotificationSettings = async (
  params: NotificationSettings,
): Promise<NotificationSettings> => {
  const { data } = await apiClient.put<NotificationSettings>(
    '/notifications/settings',
    params,
  );
  return data;
};

export const registerDeviceToken = async (params: RegisterDeviceTokenRequest): Promise<void> => {
  await apiClient.post('/notifications/devices', params);
};

export const unregisterDeviceToken = async (params: RegisterDeviceTokenRequest): Promise<void> => {
  await apiClient.delete('/notifications/devices', { data: params });
};
