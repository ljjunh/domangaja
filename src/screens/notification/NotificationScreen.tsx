import { Suspense } from 'react';
import { ActivityIndicator, SectionList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Text } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { TextButton } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { notificationMutations, notificationQueries } from '@/domains/notification/api/queries';
import type { Notification } from '@/domains/notification/types/api';
import { navigateToNotificationTarget } from '@/domains/notification/lib/notificationNavigation';
import { NotificationEmpty, NotificationListItem, NotificationSkeleton } from './components';

interface NotificationSection {
  title: string;
  isUnread: boolean;
  data: Notification[];
}

export default function NotificationScreen() {
  return (
    <Layout>
      <Suspense fallback={<NotificationFallback />}>
        <NotificationList />
      </Suspense>
    </Layout>
  );
}

function NotificationFallback() {
  return (
    <>
      <StackHeader />
      <NotificationSkeleton />
    </>
  );
}

function NotificationList() {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    notificationQueries.getNotifications(),
  );
  const { mutate: readNotification } = useMutation(notificationMutations.readNotification());
  const { mutate: readAllNotifications } = useMutation(
    notificationMutations.readAllNotifications(),
  );

  const notifications = data.pages.flatMap(page => page.content);
  const unreadItems = notifications.filter(notification => !notification.read);
  const readItems = notifications.filter(notification => notification.read);

  const sections: NotificationSection[] = [];
  if (unreadItems.length > 0) {
    sections.push({
      title: t('notification.unreadCount', { count: unreadItems.length }),
      isUnread: true,
      data: unreadItems,
    });
  }
  if (readItems.length > 0) {
    sections.push({ title: t('notification.past'), isUnread: false, data: readItems });
  }

  const openNotification = (notification: Notification) => {
    if (!notification.read) {
      readNotification(notification.id);
    }
    // 목적지 매핑은 푸시 탭과 공유한다
    navigateToNotificationTarget(notification);
  };

  return (
    <>
      <StackHeader
        right={
          <TextButton
            typography="t6"
            weight="bold"
            color={colors.grey[500]}
            onPress={
              unreadItems.length > 0
                ? () => readAllNotifications()
                : () => navigate('NotificationSetting')
            }
          >
            {unreadItems.length > 0 ? t('notification.markAllRead') : t('notification.setting')}
          </TextButton>
        }
      />

      {notifications.length === 0 ? (
        <NotificationEmpty onPressSetting={() => navigate('NotificationSetting')} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={notification => String(notification.id)}
          stickySectionHeadersEnabled={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={styles.footer} color={colors.grey[400]} />
            ) : null
          }
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text typography="t7" weight="semiBold" color={colors.grey[600]}>
                {section.title}
              </Text>
            </View>
          )}
          renderItem={({ item, section }) => (
            <NotificationListItem
              type={item.type}
              title={item.title}
              body={item.body}
              createdAt={item.createdAt}
              isUnread={section.isUnread}
              onPress={() => openNotification(item)}
            />
          )}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: colors.white,
  },
  footer: {
    paddingVertical: 20,
  },
});
