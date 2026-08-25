import { NOTIFICATION_TYPES, type NotificationType } from '@/domains/notification/types/api';

export interface PushAction {
  type: NotificationType;
  notificationId: string | null;
  targetId: string | null;
  subTargetId: string | null;
}

function toNotificationType(value: unknown): NotificationType | null {
  return NOTIFICATION_TYPES.includes(value as NotificationType)
    ? (value as NotificationType)
    : null;
}

function toId(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

export function parsePushAction(data: Record<string, unknown>): PushAction | null {
  const type = toNotificationType(data.type);
  if (type == null) {
    return null;
  }

  return {
    type,
    notificationId: toId(data.notificationId),
    targetId: toId(data.targetId),
    subTargetId: toId(data.subTargetId),
  };
}
