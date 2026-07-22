import { StyleSheet, View } from 'react-native';
import type { ToastConfig } from 'react-native-toast-message';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

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

export const toastConfig: ToastConfig = {
  success: ({ text1 }) => <ToastView message={text1} />,
  error: ({ text1 }) => <ToastView message={text1} />,
  info: ({ text1 }) => <ToastView message={text1} />,
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
});
