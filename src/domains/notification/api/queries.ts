import { queryOptions, mutationOptions } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import {
  getNotificationSetting,
  updateNotificationSettings,
} from '@/domains/notification/api/service';
import type { NotificationSettings } from '@/domains/notification/types/api';

const all = ['notification'] as const;

export const notificationQueryKeys = {
  all,
  settings: [...all, 'settings'] as const,
};

export const notificationQueries = {
  getNotificationSetting: () =>
    queryOptions({
      queryKey: notificationQueryKeys.settings,
      queryFn: getNotificationSetting,
    }),
};

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
};
