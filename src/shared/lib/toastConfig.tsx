import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { AppIcon } from '@/assets/icons/logo';

const APP_ICON_SIZE = 40;
const PUSH_TOP_GAP = 8;

interface ToastViewProps {
  message?: string;
}

function ToastView({ message }: ToastViewProps) {
  return (
    <View style={styles.toast}>
      <Text typography="st12" weight="medium" color={colors.white} style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

/**
 * 포그라운드 푸시용 — OS 알림 배너와 같은 모양.
 * OS는 종류와 무관하게 앱 아이콘만 쓰므로 알림 종류별 분기가 없다
 */
function PushToastView({ text1, text2, hide, onPress }: ToastConfigParams<unknown>) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      style={[styles.push, { marginTop: insets.top + PUSH_TOP_GAP }]}
      onPress={() => {
        hide();
        onPress();
      }}
    >
      <View style={styles.pushIconBadge}>
        <AppIcon width={APP_ICON_SIZE} height={APP_ICON_SIZE} />
      </View>
      <View style={styles.pushTexts}>
        {text1 != null && (
          <Text typography="t7" weight="bold" numberOfLines={1}>
            {text1}
          </Text>
        )}
        {text2 != null && (
          <Text typography="st12" weight="medium" color={colors.grey[600]} numberOfLines={2}>
            {text2}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export const toastConfig: ToastConfig = {
  success: ({ text1 }) => <ToastView message={text1} />,
  error: ({ text1 }) => <ToastView message={text1} />,
  info: ({ text1 }) => <ToastView message={text1} />,
  push: params => <PushToastView {...params} />,
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '90%',
    backgroundColor: colors.greyOpacity[800],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  message: {
    flexShrink: 1,
  },
  push: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '92%',
    backgroundColor: colors.blue[50],
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    boxShadow: '0 4 12 0 rgba(0, 0, 0, 0.15)',
  },
  pushIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  pushTexts: {
    flex: 1,
  },
});
