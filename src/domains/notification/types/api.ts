export interface NotificationSettings {
  pushEnabled: boolean;
  congestionAlert: boolean;
  communityAlert: boolean;
  marketingAlert: boolean;
}

export type NotificationType =
  | 'FEED_COMMENT'
  | 'STORY_LIKE'
  | 'COMMENT_LIKE'
  | 'FEED_BOOKMARK'
  | 'QUIETNESS_RISE'
  | 'MARKETING';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  targetId: number;
  subTargetId: number;
  read: boolean;
  createdAt: string;
}

export interface GetNotificationsRequest {
  // 0부터
  page: number;
  size: number;
}

export interface GetNotificationsResponse {
  content: Notification[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export type DevicePlatform = 'IOS' | 'ANDROID';

export interface RegisterDeviceTokenRequest {
  token: string;
  platform: DevicePlatform;
}
