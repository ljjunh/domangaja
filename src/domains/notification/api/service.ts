import { apiClient } from '@/shared/api/client';
import type {
  GetNotificationsRequest,
  GetNotificationsResponse,
  Notification,
  NotificationSettings,
  RegisterDeviceTokenRequest,
} from '@/domains/notification/types/api';

export const getNotifications = async (
  params: GetNotificationsRequest,
): Promise<GetNotificationsResponse> => {
  const { data } = await apiClient.get<GetNotificationsResponse>('/notifications', { params });
  return data;
};

export const readNotification = async (id: Notification['id']): Promise<void> => {
  await apiClient.post(`/notifications/${id}/read`);
};

export const readAllNotifications = async (): Promise<void> => {
  await apiClient.post('/notifications/read-all');
};

export const getNotificationSetting = async (): Promise<NotificationSettings> => {
  const { data } = await apiClient.get<NotificationSettings>('/notifications/settings');
  return data;
};

export const updateNotificationSettings = async (
  params: NotificationSettings,
): Promise<NotificationSettings> => {
  const { data } = await apiClient.put<NotificationSettings>('/notifications/settings', params);
  return data;
};

export const registerDeviceToken = async (params: RegisterDeviceTokenRequest): Promise<void> => {
  await apiClient.post('/notifications/devices', params);
};

export const unregisterDeviceToken = async (params: RegisterDeviceTokenRequest): Promise<void> => {
  await apiClient.delete('/notifications/devices', { data: params });
};
