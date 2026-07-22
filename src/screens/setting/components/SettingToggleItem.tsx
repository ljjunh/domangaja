import { type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { type SvgProps } from 'react-native-svg';
import { Pressable, Switch, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface SettingToggleItemProps {
  icon?: ComponentType<SvgProps>;
  iconColor?: string;
  badgeColor?: string;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function SettingToggleItem({
  icon: Icon,
  iconColor,
  badgeColor,
  title,
  description,
  value,
  onValueChange,
  disabled = false,
}: SettingToggleItemProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      style={[styles.container, disabled && styles.dimmed]}
    >
      <View style={styles.left}>
        {Icon && (
          <View style={[styles.iconBadge, { backgroundColor: badgeColor }]}>
            <Icon width={24} height={24} color={iconColor} />
          </View>
        )}
        <View style={styles.texts}>
          <Text typography="t6" weight="semiBold">
            {title}
          </Text>
          <Text numberOfLines={1} typography="t7" weight="medium" color={colors.grey[500]}>
            {description}
          </Text>
        </View>
      </View>
      <View>
        <Switch value={value} onValueChange={onValueChange} disabled={disabled} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  dimmed: {
    opacity: 0.4,
  },
  left: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flexShrink: 1,
  },
  iconBadge: {
    padding: 6,
    borderRadius: 20,
  },
  texts: {
    flexShrink: 1,
    gap: 0,
  },
});
