import { type ReactNode, type Ref } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { colors } from '@/shared/constants/colors';
import { type TypographyKey } from '@/shared/constants/typography';
import { Text } from '@/shared/components/base';

type ButtonType = 'primary' | 'danger' | 'light' | 'dark';
type ButtonVariant = 'fill' | 'weak';
type ButtonSize = 'big' | 'large' | 'medium' | 'tiny';
type ButtonDisplay = 'block' | 'inline';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  children: ReactNode;
  /**
   * @default 'primary'
   */
  type?: ButtonType;
  /**
   * 'fill'은 채워진 스타일, 'weak'은 옅은 스타일.
   * @default 'fill'
   */
  variant?: ButtonVariant;
  /**
   * @default 'big'
   */
  size?: ButtonSize;
  /**
   * @default 'inline'
   */
  display?: ButtonDisplay;
  /**
   * @default false
   */
  loading?: boolean;
  /**
   * 텍스트 색상 override.
   */
  color?: string;
  leftAccessory?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  ref?: Ref<View>;
}

const sizeStyle: Record<ButtonSize, ViewStyle> = {
  tiny: { paddingHorizontal: 10, paddingVertical: 2, minHeight: 32, minWidth: 52, borderRadius: 8 },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    minHeight: 38,
    minWidth: 64,
    borderRadius: 10,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 2,
    minHeight: 48,
    minWidth: 80,
    borderRadius: 14,
  },
  big: { paddingHorizontal: 28, paddingVertical: 2, minHeight: 56, minWidth: 96, borderRadius: 16 },
};

const sizeTypography: Record<ButtonSize, TypographyKey> = {
  tiny: 't7',
  medium: 't6',
  large: 't5',
  big: 't5',
};

const colorByTypeVariant: Record<
  ButtonType,
  Record<ButtonVariant, { bg: string; text: string }>
> = {
  primary: {
    fill: { bg: colors.blue[500], text: colors.white },
    weak: { bg: colors.blue[50], text: colors.blue[500] },
  },
  danger: {
    fill: { bg: colors.red[500], text: colors.white },
    weak: { bg: colors.red[50], text: colors.red[500] },
  },
  light: {
    fill: { bg: colors.grey[100], text: colors.grey[800] },
    weak: { bg: 'transparent', text: colors.grey[800] },
  },
  dark: {
    fill: { bg: colors.grey[900], text: colors.white },
    weak: { bg: colors.greyOpacity[100], text: colors.grey[900] },
  },
};

const displayStyle: Record<ButtonDisplay, ViewStyle> = {
  inline: { alignSelf: 'flex-start' },
  block: { alignSelf: 'stretch' },
};

export default function Button({
  children,
  type = 'primary',
  variant = 'fill',
  size = 'big',
  display = 'inline',
  loading = false,
  disabled = false,
  color,
  leftAccessory,
  containerStyle,
  textStyle,
  ref,
  ...rest
}: ButtonProps) {
  const palette = colorByTypeVariant[type][variant];
  const textColor = color ?? palette.text;
  const isDisabled = disabled || loading;

  return (
    <Pressable
      ref={ref}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        sizeStyle[size],
        displayStyle[display],
        { backgroundColor: palette.bg },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        containerStyle,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {leftAccessory}
          <Text
            typography={sizeTypography[size]}
            weight="semiBold"
            color={textColor}
            style={textStyle}
          >
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.4,
  },
});
