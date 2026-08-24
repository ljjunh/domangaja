import { FlatList, ImageBackground, StyleSheet, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { colors } from '@/shared/constants/colors';
import { SPOT_THEMES, type SpotTheme } from '@/shared/types/spotTheme';
import { SPOT_THEME_IMAGES } from '@/assets/images/spotTheme';

const COLUMN_COUNT = 2;
const COLUMN_GAP = 12;

export default function ThemeBrowseScreen() {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth =
    (windowWidth - SCREEN_PADDING_HORIZONTAL * 2 - COLUMN_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

  return (
    <Layout>
      <StackHeader title={t('spot.theme.browse.title')} />
      <FlatList
        data={SPOT_THEMES}
        keyExtractor={theme => theme}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ThemeBrowseCard
            theme={item}
            width={cardWidth}
            onPress={() => navigate('ThemeSpot', { theme: item })}
          />
        )}
      />
    </Layout>
  );
}

function ThemeBrowseCard({
  theme,
  width,
  onPress,
}: {
  theme: SpotTheme;
  width: number;
  onPress: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={[styles.card, { width }]}>
      <ImageBackground source={SPOT_THEME_IMAGES.square[theme]} style={styles.image}>
        <Text typography="t7" weight="bold" color={colors.white} style={styles.cardTitle}>
          {t(`spot.theme.names.${theme}`)}
        </Text>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingBottom: 24,
    gap: COLUMN_GAP,
  },
  row: {
    gap: COLUMN_GAP,
  },
  card: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  image: {
    aspectRatio: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },
  cardTitle: {
    textShadowColor: colors.greyOpacity[600],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
