import { type Ref } from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  type TextInputProps as RNTextInputProps,
} from 'react-native';
import { colors } from '@/shared/constants/colors';
import { fontFamilyByWeight, type FontWeight } from '@/shared/constants/font';
import { typography as typographyMap, type TypographyKey } from '@/shared/constants/typography';

export interface TextInputProps extends RNTextInputProps {
  typography: TypographyKey;
  /**
   * @default 'regular'
   */
  weight?: FontWeight;
  /**
   * @default colors.grey[500]
   */
  color?: string;
  ref?: Ref<RNTextInput>;
}

export default function TextInput({
  typography,
  weight = 'regular',
  color = colors.black,
  style,
  placeholderTextColor = colors.grey[500],
  ref,
  ...rest
}: TextInputProps) {
  // TextInput에는 lineHeight를 적용하지 않는다 (Android 캐럿/정렬 깨짐) — fontSize만 사용
  const { fontSize } = typographyMap[typography];

  return (
    <RNTextInput
      ref={ref}
      allowFontScaling={false}
      placeholderTextColor={placeholderTextColor}
      style={[styles.base, { fontSize, fontFamily: fontFamilyByWeight[weight], color }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 0,
  },
});
