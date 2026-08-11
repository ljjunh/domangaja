import { StyleSheet, View } from 'react-native';
import { Text, Pressable } from '@/shared/components/base';
import { enableNotificationPermission } from '@/domains/notification/lib/permission';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { NotificationOffOutlineIcon, ArrowRightIcon } from '@/assets/icons/common';

export default function NotificationPermissionBanner() {
  return (
    <Pressable onPress={enableNotificationPermission} style={styles.container}>
      <View style={styles.message}>
        <NotificationOffOutlineIcon width={16} height={16} color={colors.white} />
        <Text typography="t7" weight="medium" color={colors.white}>
          기기 알림 설정이 꺼져있어요
        </Text>
      </View>

      <View style={styles.action}>
        <Text typography="t7" weight="medium" color={colors.white}>
          켜기
        </Text>
        <ArrowRightIcon width={16} height={16} color={colors.white} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue[500],
    paddingVertical: 4,
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
  message: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
