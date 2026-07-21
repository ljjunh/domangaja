import { type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { type SvgProps } from 'react-native-svg';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { ArrowRightIcon } from '@/assets/icons/common';

interface SettingListItemProps {
  icon: ComponentType<SvgProps>;
  iconColor: string;
  label: string;
  value?: string;
  onPress?: () => void;
}

export default function SettingListItem({
  icon: Icon,
  iconColor,
  label,
  value,
  onPress,
}: SettingListItemProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconBadge}>
          <Icon width={24} height={24} color={iconColor} />
        </View>
        <Text typography="t5" weight="semiBold">
          {label}
        </Text>
      </View>
      <View style={styles.right}>
        {!!value && (
          <Text numberOfLines={1} typography="t6" weight="semiBold" color={colors.grey[500]}>
            {value}
          </Text>
        )}
        {onPress && <ArrowRightIcon width={24} height={24} color={colors.grey[500]} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    padding: 9,
    borderRadius: 12,
    backgroundColor: colors.grey[100],
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
});
