import { FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { colors } from '@/shared/constants/colors';
import { TOURISM_SPOT_THEMES } from '@/shared/types/spotTheme';
import { ThemeBrowseCard } from '@/domains/spot/components';

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
        data={TOURISM_SPOT_THEMES}
        keyExtractor={theme => theme}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <Text typography="t7" weight="medium" color={colors.grey[500]}>
            {t('spot.theme.popular.count', { count: TOURISM_SPOT_THEMES.length })}
          </Text>
        }
        renderItem={({ item }) => (
          <ThemeBrowseCard
            theme={item}
            style={{ width: cardWidth }}
            onPress={() => navigate('ThemeSpot', { theme: item })}
          />
        )}
      />
    </Layout>
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
});
