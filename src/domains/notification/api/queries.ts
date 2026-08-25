import {
  queryOptions,
  mutationOptions,
  infiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import {
  getNotificationSetting,
  getNotifications,
  readAllNotifications,
  readNotification,
  updateNotificationSettings,
} from '@/domains/notification/api/service';
import type {
  GetNotificationsResponse,
  Notification,
  NotificationSettings,
} from '@/domains/notification/types/api';

const all = ['notification'] as const;
const PAGE_SIZE = 20;

export const notificationQueryKeys = {
  all,
  settings: [...all, 'settings'] as const,
  list: [...all, 'list'] as const,
};

/**
 * 푸시가 도착·탭됐으면 목록에 새 알림이 쌓였다.
 * 포그라운드·백그라운드 두 경로가 각자 부르면 갈라지므로 여기 한 곳에 둔다
 */
export function invalidateNotificationList() {
  queryClient.invalidateQueries({ queryKey: notificationQueryKeys.list });
}

/**
 * 푸시를 탭해 들어왔을 때 — 봤으니 읽음으로 표시하고 목록을 갱신한다.
 * React 밖(navigateByPush)에서 불리므로 mutation 대신 서비스를 직접 쓴다
 */
export async function markPushNotificationRead(notificationId: string | null) {
  if (notificationId != null) {
    try {
      await readNotification(Number(notificationId));
    } catch {
      // 읽음 표시 실패가 화면 이동을 막을 이유는 없다 — 목록 갱신은 그대로 진행
    }
  }
  invalidateNotificationList();
}

export const notificationQueries = {
  getNotificationSetting: () =>
    queryOptions({
      queryKey: notificationQueryKeys.settings,
      queryFn: getNotificationSetting,
    }),

  getNotifications: () =>
    infiniteQueryOptions({
      queryKey: notificationQueryKeys.list,
      queryFn: ({ pageParam }) => getNotifications({ page: pageParam, size: PAGE_SIZE }),
      initialPageParam: 0,
      getNextPageParam: lastPage => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    }),
};

type NotificationPages = InfiniteData<GetNotificationsResponse, number>;

function setNotificationsRead(shouldRead: (notification: Notification) => boolean) {
  queryClient.setQueryData<NotificationPages>(notificationQueryKeys.list, prev =>
    prev == null
      ? prev
      : {
          ...prev,
          pages: prev.pages.map(page => ({
            ...page,
            content: page.content.map(notification =>
              shouldRead(notification) ? { ...notification, read: true } : notification,
            ),
          })),
        },
  );
}

export const notificationMutations = {
  updateNotificationSettings: () =>
    mutationOptions({
      mutationFn: updateNotificationSettings,
      onMutate: async (next: NotificationSettings) => {
        await queryClient.cancelQueries({ queryKey: notificationQueryKeys.settings });
        const previous = queryClient.getQueryData<NotificationSettings>(
          notificationQueryKeys.settings,
        );
        queryClient.setQueryData(notificationQueryKeys.settings, next);
        return { previous };
      },
      onError: (_error, _next, context) => {
        queryClient.setQueryData(notificationQueryKeys.settings, context?.previous);
      },
      onSuccess: data => {
        queryClient.setQueryData(notificationQueryKeys.settings, data);
      },
    }),

  readNotification: () =>
    mutationOptions({
      mutationFn: readNotification,
      onMutate: async (id: Notification['id']) => {
        await queryClient.cancelQueries({ queryKey: notificationQueryKeys.list });
        const previous = queryClient.getQueryData<NotificationPages>(notificationQueryKeys.list);
        setNotificationsRead(notification => notification.id === id);
        return { previous };
      },
      onError: (_error, _id, context) => {
        queryClient.setQueryData(notificationQueryKeys.list, context?.previous);
      },
    }),

  readAllNotifications: () =>
    mutationOptions({
      mutationFn: readAllNotifications,
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: notificationQueryKeys.list });
        const previous = queryClient.getQueryData<NotificationPages>(notificationQueryKeys.list);
        setNotificationsRead(() => true);
        return { previous };
      },
      onError: (_error, _variables, context) => {
        queryClient.setQueryData(notificationQueryKeys.list, context?.previous);
      },
    }),
};
