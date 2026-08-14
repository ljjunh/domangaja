import { type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { type SvgProps } from 'react-native-svg';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface EmptyStateProps {
  icon: ComponentType<SvgProps>;
  title: string;
  description: string;
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Icon width={18} height={18} color={colors.grey[500]} />
      </View>
      <View style={styles.texts}>
        <Text typography="t7" weight="semiBold">
          {title}
        </Text>
        <Text typography="st12" weight="medium" color={colors.grey[600]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.grey[100],
    gap: 12,
    paddingVertical: 20,
  },
  badge: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 14,
  },
  texts: {
    alignItems: 'center',
    gap: 5,
  },
});
