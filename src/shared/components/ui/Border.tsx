import { StyleSheet, View, type ViewProps } from 'react-native';
import { colors } from '@/shared/constants/colors';

export type BorderType = 'full' | 'padding24' | 'height16';

// full/padding24는 얇은 선(height 지정 불가), height16은 섹션 공간(height 지정 가능)
type HairlineProps = { type?: 'full' | 'padding24'; height?: undefined };
type SpaceProps = { type: 'height16'; height?: number };
type BorderProps = (HairlineProps | SpaceProps) & ViewProps;

export default function Border({ type = 'full', style, height, ...rest }: BorderProps) {
  if (type === 'height16') {
    return (
      <View
        style={[{ width: '100%', height: height ?? 16, backgroundColor: colors.grey[100] }, style]}
        {...rest}
      />
    );
  }

  if (type === 'padding24') {
    return (
      <View style={[styles.padding24, style]} {...rest}>
        <View style={styles.hairline} />
      </View>
    );
  }

  // full
  return <View style={[styles.hairline, styles.full, style]} {...rest} />;
}

const styles = StyleSheet.create({
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.greyOpacity[300],
  },
  full: {
    width: '100%',
  },
  padding24: {
    paddingLeft: 24,
  },
});
