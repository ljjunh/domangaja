import { type Ref } from 'react';
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';
import { colors } from '@/shared/constants/colors';
import { typography as typographyMap, type TypographyKey } from '@/shared/constants/typography';

const fontFamilyByWeight = {
  thin: 'Pretendard-Thin',
  extraLight: 'Pretendard-ExtraLight',
  light: 'Pretendard-Light',
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  semiBold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
  extraBold: 'Pretendard-ExtraBold',
  black: 'Pretendard-Black',
} as const;

export type FontWeight = keyof typeof fontFamilyByWeight;

export interface TextProps extends RNTextProps {
  typography: TypographyKey;
  /**
   * @default 'regular'
   */
  weight?: FontWeight;
  /**
   * @default colors.black
   */
  color?: string;
  textAlign?: TextStyle['textAlign'];
  ref?: Ref<RNText>;
}

export default function Text({
  typography,
  weight = 'regular',
  color = colors.black,
  textAlign,
  style,
  lineBreakStrategyIOS = 'hangul-word',
  ref,
  ...rest
}: TextProps) {
  return (
    <RNText
      ref={ref}
      allowFontScaling={false}
      lineBreakStrategyIOS={lineBreakStrategyIOS}
      style={[
        styles.base,
        typographyMap[typography],
        { fontFamily: fontFamilyByWeight[weight], color, textAlign },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    flexShrink: 1,
    includeFontPadding: false,
  },
});
