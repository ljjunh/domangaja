import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface SettingSectionProps {
  title: string;
  children: ReactNode;
}

export default function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <View style={styles.section}>
      <Text typography="t6" weight="semiBold" color={colors.grey[500]}>
        {title}
      </Text>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 4,
  },
});
