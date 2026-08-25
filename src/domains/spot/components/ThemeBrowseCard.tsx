import { ImageBackground, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import type { TourismSpotTheme } from '@/shared/types/spotTheme';
import { SPOT_THEME_IMAGES } from '@/assets/images/spotTheme';

interface ThemeBrowseCardProps {
  theme: TourismSpotTheme;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function ThemeBrowseCard({ theme, onPress, style }: ThemeBrowseCardProps) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={[styles.card, style]}>
      <ImageBackground source={SPOT_THEME_IMAGES.square[theme]} style={styles.image}>
        <Text typography="t7" weight="bold" color={colors.white} style={styles.title}>
          {t(`spot.theme.names.${theme}`)}
        </Text>
      </ImageBackground>
    </Pressable>
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
    padding: 12,
  },
  title: {
    textShadowColor: colors.greyOpacity[600],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
