import { type FC, type Ref } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type View,
  type ViewStyle,
} from 'react-native';
import { type SvgProps } from 'react-native-svg';
import { colors } from '@/shared/constants/colors';

type IconButtonVariant = 'fill' | 'clear' | 'border';

export interface IconButtonProps extends Omit<PressableProps, 'style'> {
  /**
   * SVG 아이콘 컴포넌트. iconSize/color가 주입
   */
  icon: FC<SvgProps>;
  /**
   * @default 'clear'
   */
  variant?: IconButtonVariant;
  /**
   * 아이콘 색상. (지정 시 SvgProps.color로 전달 — 아이콘이 currentColor를 써야 적용됨)
   */
  color?: string;
  /**
   * 배경색. variant가 'fill'이면 항상, 'clear'·'border'면 눌렀을 때만 적용
   * @default colors.greyOpacity[100]
   */
  bgColor?: string;
  /**
   * @default 24
   */
  iconSize?: number;
  /**
   * 접근성 라벨 (accessibilityLabel)
   */
  label?: string;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<View>;
}

// 아이콘 크기에 따른 padding / borderRadius
function getPadding(iconSize: number) {
  return iconSize >= 18 && iconSize <= 20 ? 9 : iconSize / 2;
}

function getBorderRadius(iconSize: number) {
  return iconSize <= 16 ? 6 : iconSize <= 20 ? 8 : 12;
}

export default function IconButton({
  icon: Icon,
  variant = 'clear',
  color,
  bgColor = colors.greyOpacity[100],
  iconSize = 24,
  label,
  style,
  ref,
  ...rest
}: IconButtonProps) {
  const padding = getPadding(iconSize);
  const borderRadius = getBorderRadius(iconSize);

  return (
    <Pressable
      ref={ref}
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        {
          alignSelf: 'flex-start',
          padding,
          borderRadius,
          transform: [{ scale: pressed ? 0.92 : 1 }],
          // fill: 항상 배경색 적용
          //  clear·border: 눌렀을 때만 배경색 적용
          backgroundColor: variant === 'fill' || pressed ? bgColor : 'transparent',
          ...(variant === 'border'
            ? { borderWidth: 1, borderColor: colors.greyOpacity[100] }
            : null),
        },
        style,
      ]}
      {...rest}
    >
      <Icon width={iconSize} height={iconSize} color={color} />
    </Pressable>
  );
}
