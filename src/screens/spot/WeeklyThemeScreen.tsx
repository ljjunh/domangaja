import { Suspense } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Text } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { EmptyState } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { spotQueries } from '@/domains/spot/api/queries';
import { ThemeCard } from '@/domains/spot/components';
import { ClockOutlineIcon } from '@/assets/icons/common';
import { SPOT_THEME_IMAGES } from '@/assets/images/spotTheme';
import { WeeklyThemeSkeleton } from './components';

// 서버가 인기순으로 내려주므로 앞의 2 개에만 HOT을 붙인다
const HOT_THEME_COUNT = 2;
const COLUMN_COUNT = 2;
const COLUMN_GAP = 12;

export default function WeeklyThemeScreen() {
  const { t } = useTranslation();

  return (
    <Layout>
      <StackHeader title={t('spot.theme.popular.title')} />
      <Suspense
        fallback={
          <View style={styles.placeholder}>
            <WeeklyThemeSkeleton />
          </View>
        }
      >
        <WeeklyThemeGrid />
      </Suspense>
    </Layout>
  );
}

function WeeklyThemeGrid() {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const { data: themes } = useSuspenseQuery(spotQueries.getWeeklyThemes({ spotLimit: 20 }));

  const cardWidth =
    (windowWidth - SCREEN_PADDING_HORIZONTAL * 2 - COLUMN_GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

  if (themes.length === 0) {
    return (
      <View style={styles.placeholder}>
        <EmptyState
          icon={ClockOutlineIcon}
          title={t('spot.theme.popular.empty.title')}
          description={t('spot.theme.popular.empty.description')}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={themes}
      keyExtractor={theme => theme.theme}
      numColumns={COLUMN_COUNT}
      contentContainerStyle={styles.grid}
      columnWrapperStyle={styles.row}
      ListHeaderComponent={
        <Text typography="t7" weight="medium" color={colors.grey[500]}>
          {t('spot.theme.popular.count', { count: themes.length })}
        </Text>
      }
      renderItem={({ item, index }) => (
        <ThemeCard
          name={t(`spot.theme.names.${item.theme}`)}
          spotCount={item.spotCount}
          image={SPOT_THEME_IMAGES.square[item.theme]}
          isHot={index < HOT_THEME_COUNT}
          style={{ width: cardWidth }}
          onPress={() => navigate('PopularThemeSpot', { theme: item.theme, spots: item.spots })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: COLUMN_GAP,
  },
  row: {
    gap: COLUMN_GAP,
  },
  placeholder: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
});
