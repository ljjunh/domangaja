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
