import { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { colors } from '@/shared/constants/colors';
import { type FontWeight } from '@/shared/constants/font';
import { type TypographyKey } from '@/shared/constants/typography';
import { Text } from '@/shared/components/base/';

type TextButtonVariant = 'arrow' | 'underline' | 'clear';
type TextButtonWeight = 'regular' | 'medium' | 'semibold' | 'semiBold' | 'bold';

const fontWeightByWeight: Record<TextButtonWeight, FontWeight> = {
  regular: 'regular',
  medium: 'medium',
  semibold: 'semiBold',
  semiBold: 'semiBold',
  bold: 'bold',
};

export interface TextButtonProps {
  /**
   * @default 'clear'
   */
  variant?: TextButtonVariant;
  disabled?: boolean;
  typography: TypographyKey;
  /**
   * @default 'regular'
   */
  weight?: TextButtonWeight;
  /**
   * @default colors.grey[800]
   */
  color?: string;
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

// press 시 텍스트보다 살짝 크게 나타나는 둥근 하이라이트의 inset
type Inset = { top: number; right: number; bottom: number; left: number; borderRadius: number };
const UNDERLAY: Record<
  'level1' | 'level2' | 'level3' | 'level4' | 'level5',
  { arrow: Inset; rest: Inset }
> = {
  level5: {
    arrow: { top: -9, right: 0, bottom: -9, left: -15, borderRadius: 15 },
    rest: { top: -9, right: -15, bottom: -9, left: -15, borderRadius: 15 },
  },
  level4: {
    arrow: { top: -7, right: 0, bottom: -7, left: -13, borderRadius: 13 },
    rest: { top: -7, right: -13, bottom: -7, left: -13, borderRadius: 13 },
  },
  level3: {
    arrow: { top: -5, right: 0, bottom: -5, left: -11, borderRadius: 11 },
    rest: { top: -5, right: -11, bottom: -5, left: -11, borderRadius: 11 },
  },
  level2: {
    arrow: { top: -4, right: 0, bottom: -4, left: -9, borderRadius: 9 },
    rest: { top: -4, right: -9, bottom: -4, left: -9, borderRadius: 9 },
  },
  level1: {
    arrow: { top: -3, right: 0, bottom: -3, left: -7, borderRadius: 7 },
    rest: { top: -3, right: -7, bottom: -3, left: -7, borderRadius: 7 },
  },
};

function getUnderlayLevel(typography: TypographyKey) {
  switch (typography) {
    case 't1':
    case 'st1':
      return UNDERLAY.level5;
    case 'st2':
    case 'st3':
    case 't2':
    case 'st4':
    case 'st5':
    case 'st6':
      return UNDERLAY.level4;
    case 't3':
    case 'st7':
    case 't4':
    case 'st8':
      return UNDERLAY.level3;
    case 'st9':
    case 't5':
    case 'st10':
      return UNDERLAY.level2;
    default:
      return UNDERLAY.level1;
  }
}

function getLinkPadding(typography: TypographyKey) {
  switch (typography) {
    case 't1':
    case 'st1':
      return { paddingVertical: 2, paddingHorizontal: 8 };
    case 'st2':
    case 'st3':
    case 't2':
    case 'st4':
    case 'st5':
    case 'st6':
      return { paddingVertical: 1, paddingHorizontal: 6 };
    case 't3':
    case 'st7':
    case 't4':
    case 'st8':
      return { paddingVertical: 0, paddingHorizontal: 5 };
    default:
      return { paddingVertical: 0, paddingHorizontal: 4 };
  }
}

function getArrowSize(typography: TypographyKey) {
  switch (typography) {
    case 't1':
    case 'st1':
    case 'st2':
      return 31;
    case 'st11':
    case 't7':
    case 'st12':
    case 'st13':
      return 20;
    default:
      return 24;
  }
}

function ArrowRight({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h14M13 6l6 6-6 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function TextButton({
  variant = 'clear',
  disabled = false,
  typography,
  weight = 'regular',
  color = colors.grey[800],
  onPress,
  style,
  children,
}: TextButtonProps) {
  const isArrow = variant === 'arrow';
  const { paddingVertical, paddingHorizontal } = getLinkPadding(typography);
  const level = getUnderlayLevel(typography);
  const underlayInset = isArrow ? level.arrow : level.rest;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={styles.pressable}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.base,
            {
              paddingVertical,
              paddingHorizontal,
              paddingRight: isArrow ? 0 : paddingHorizontal,
              marginVertical: -paddingVertical,
              marginHorizontal: -paddingHorizontal,
              marginRight: isArrow ? 0 : -paddingHorizontal,
              opacity: disabled ? 0.38 : 1,
            },
            style,
          ]}
        >
          {pressed && !disabled && (
            <View
              style={[styles.underlay, underlayInset, { backgroundColor: colors.greyOpacity[100] }]}
            />
          )}
          <Text
            typography={typography}
            weight={fontWeightByWeight[weight]}
            color={color}
            style={{
              textDecorationLine: variant === 'underline' ? 'underline' : 'none',
              textDecorationColor: color,
            }}
          >
            {children}
          </Text>
          {isArrow && <ArrowRight size={getArrowSize(typography)} color={color} />}
        </View>
      )}
    </Pressable>
  );
}

// 인접한 TextButton 사이의 권장 간격. 컴포넌트 자체 스타일이 아니라,
// 여러 개를 나란히 배치하는 부모가 사용하는 값
// 예: <View style={{ gap: TextButton.gap }}><TextButton/><TextButton/></View>
TextButton.gap = 8;

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'flex-start',
  },
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  underlay: {
    position: 'absolute',
  },
});
