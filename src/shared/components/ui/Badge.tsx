import { Text as RNText, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/shared/constants/colors';
import { fontFamilyByWeight, type FontWeight } from '@/shared/constants/font';

type BadgeSize = 'large' | 'medium' | 'small' | 'tiny';
type BadgeType = 'blue' | 'teal' | 'green' | 'red' | 'yellow' | 'elephant';
type BadgeStyleVariant = 'fill' | 'weak';

export interface BadgeProps {
  children: string;
  /**
   * @default 'small'
   */
  size?: BadgeSize;
  /**
   * @default 'blue'
   */
  type?: BadgeType;
  /**
   * 'fill'은 채도 높은 스타일, 'weak'은 옅은 스타일
   * @default 'fill'
   */
  badgeStyle?: BadgeStyleVariant;
  /**
   * @default 'bold' (tiny는 'semiBold')
   */
  fontWeight?: FontWeight;
  marginLeft?: number;
  marginRight?: number;
  style?: StyleProp<ViewStyle>;
}

const sizeStyle: Record<
  BadgeSize,
  { fontSize: number; paddingVertical: number; paddingHorizontal: number; borderRadius: number }
> = {
  tiny: { fontSize: 10, paddingVertical: 3, paddingHorizontal: 7, borderRadius: 9 },
  small: { fontSize: 12, paddingVertical: 3, paddingHorizontal: 7, borderRadius: 11 },
  medium: { fontSize: 13, paddingVertical: 3, paddingHorizontal: 7, borderRadius: 12 },
  large: { fontSize: 14, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 13 },
};

const fontWeightBySize: Record<BadgeSize, FontWeight> = {
  tiny: 'semiBold',
  small: 'bold',
  medium: 'bold',
  large: 'bold',
};

function withAlpha(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const colorMap: Record<BadgeType, Record<BadgeStyleVariant, { bg: string; text: string }>> = {
  blue: {
    fill: { bg: colors.blue[500], text: colors.white },
    weak: { bg: withAlpha(colors.blue[500], 0.16), text: colors.blue[700] },
  },
  teal: {
    fill: { bg: colors.teal[600], text: colors.white },
    weak: { bg: withAlpha(colors.teal[600], 0.16), text: colors.teal[700] },
  },
  green: {
    fill: { bg: colors.green[600], text: colors.white },
    weak: { bg: withAlpha(colors.green[600], 0.16), text: colors.green[700] },
  },
  red: {
    fill: { bg: colors.red[500], text: colors.white },
    weak: { bg: withAlpha(colors.red[500], 0.16), text: colors.red[700] },
  },
  yellow: {
    fill: { bg: colors.yellow[500], text: colors.grey[800] },
    weak: { bg: withAlpha(colors.yellow[600], 0.16), text: colors.yellow[900] },
  },
  elephant: {
    fill: { bg: colors.grey[700], text: colors.white },
    weak: { bg: withAlpha(colors.grey[700], 0.16), text: colors.grey[700] },
  },
};

export default function Badge({
  children,
  size = 'small',
  type = 'blue',
  badgeStyle = 'fill',
  fontWeight,
  marginLeft = 0,
  marginRight = 0,
  style,
}: BadgeProps) {
  const { fontSize, paddingVertical, paddingHorizontal, borderRadius } = sizeStyle[size];
  const { bg, text } = colorMap[type][badgeStyle];
  const weight = fontWeight ?? fontWeightBySize[size];

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          paddingVertical,
          paddingHorizontal,
          borderRadius,
          backgroundColor: bg,
          marginLeft,
          marginRight,
        },
        style,
      ]}
    >
      <RNText
        allowFontScaling={false}
        style={[styles.label, { fontFamily: fontFamilyByWeight[weight], fontSize, color: text }]}
      >
        {children}
      </RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
