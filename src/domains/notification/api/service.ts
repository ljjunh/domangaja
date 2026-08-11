import { apiClient } from '@/shared/api/client';
import type {
  NotificationSettings,
  RegisterDeviceTokenRequest,
} from '@/domains/notification/types/api';

export const getNotificationSetting = async (): Promise<NotificationSettings> => {
  const { data } = await apiClient.get<NotificationSettings>('/api/v1/notifications/settings');
  return data;
};

export const updateNotificationSettings = async (
  params: NotificationSettings,
): Promise<NotificationSettings> => {
  const { data } = await apiClient.put<NotificationSettings>(
    '/api/v1/notifications/settings',
    params,
  );
  return data;
};

export const registerDeviceToken = async (params: RegisterDeviceTokenRequest): Promise<void> => {
  await apiClient.post('/api/v1/notifications/devices', params);
};

export const unregisterDeviceToken = async (params: RegisterDeviceTokenRequest): Promise<void> => {
  await apiClient.delete('/api/v1/notifications/devices', { data: params });
};
