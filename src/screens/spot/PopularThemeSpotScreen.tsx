import { FlatList, StyleSheet, View } from 'react-native';
import { type StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { EmptyState } from '@/shared/components/ui';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import type { SpotTheme } from '@/shared/types/spotTheme';
import type { PopularSpot } from '@/domains/spot/types/api';
import { ThemeInterestButton, ThemeSpotListItem } from '@/domains/spot/components';
import { ClockOutlineIcon } from '@/assets/icons/common';

type Props = StaticScreenProps<{ theme: SpotTheme; spots: PopularSpot[] }>;

// TODO: 인기 테마별 장소 API 페이지네이션 요청하기
export default function PopularThemeSpotScreen({ route }: Props) {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { theme, spots } = route.params;

  return (
    <Layout>
      <StackHeader title={t('spot.theme.popular.title')} />
      <FlatList
        data={spots}
        keyExtractor={spot => spot.contentId}
        contentContainerStyle={[styles.list, spots.length === 0 && styles.emptyList]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text typography="t6" weight="semiBold">
              {t(`spot.theme.names.${theme}`)}
            </Text>
            <ThemeInterestButton theme={theme} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon={ClockOutlineIcon}
            title={t('spot.theme.result.empty.title')}
            description={t('spot.theme.result.empty.description')}
          />
        }
        renderItem={({ item }) => (
          <ThemeSpotListItem
            spot={item}
            onPress={() => navigate('SpotDetail', { contentId: item.contentId })}
          />
        )}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: SCREEN_PADDING_HORIZONTAL, paddingBottom: 24, gap: 12 },
  emptyList: { flexGrow: 1 },
  header: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
