import { apiClient } from '@/shared/api/client';
import type { NotificationSettings } from '@/domains/notification/types/api';

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
