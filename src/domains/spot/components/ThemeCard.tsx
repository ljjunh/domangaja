import {
  ImageBackground,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface ThemeCardProps {
  name: string;
  spotCount: number;
  image: ImageSourcePropType;
  isHot?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function ThemeCard({
  name,
  spotCount,
  image,
  isHot = false,
  style,
}: ThemeCardProps) {
  const { t } = useTranslation();

  // TODO: 인기 테마의 관광지 목록 조회 API 확인 후 카드 클릭 연동
  return (
    <View style={[styles.card, style]}>
      <ImageBackground source={image} fadeDuration={0} style={styles.image}>
        {isHot && (
          <View style={styles.hotBadge}>
            <Text typography="st13" weight="bold" color={colors.red[500]}>
              HOT
            </Text>
          </View>
        )}
        <Text typography="st12" weight="semiBold" color={colors.white} style={styles.textShadow}>
          {name}
        </Text>
        <Text typography="st13" weight="semiBold" color={colors.white} style={styles.textShadow}>
          {t('spot.theme.popular.spotCount', { count: spotCount })}
        </Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  image: {
    aspectRatio: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  hotBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.white,
  },
  textShadow: {
    textShadowColor: colors.greyOpacity[600],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
