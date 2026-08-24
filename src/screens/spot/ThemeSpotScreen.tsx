import { Suspense } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { Button, EmptyState } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { formatQuietness } from '@/shared/utils/formatQuietness';
import type { TourismSpotTheme } from '@/shared/types/spotTheme';
import { spotQueries } from '@/domains/spot/api/queries';
import type { ThemeSpot } from '@/domains/spot/types/api';
import { userMutations, userQueries } from '@/domains/user/api/queries';
import { ClockOutlineIcon } from '@/assets/icons/common';
import { placeholderImage } from '@/assets/images';
import { RecentSpotSkeleton } from './components';

const THEME_SPOT_LIMIT = 20;

type ThemeSpotScreenProps = StaticScreenProps<{ theme: TourismSpotTheme }>;

// TODO: 컴포넌트 분리하기, screens/spot/components 디렉토리도 점검하기
export default function ThemeSpotScreen({ route }: ThemeSpotScreenProps) {
  const { t } = useTranslation();

  return (
    <Layout>
      <StackHeader title={t('spot.theme.browse.title')} />
      <Suspense
        fallback={
          <View style={styles.skeleton}>
            <RecentSpotSkeleton />
          </View>
        }
      >
        <ThemeSpotList theme={route.params.theme} />
      </Suspense>
    </Layout>
  );
}

function ThemeSpotList({ theme }: { theme: TourismSpotTheme }) {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { data: spots } = useSuspenseQuery(
    spotQueries.getThemeSpots({ theme, limit: THEME_SPOT_LIMIT }),
  );
  const { data: me } = useSuspenseQuery(userQueries.getMe());
  const { mutate: saveProfile, isPending } = useMutation(userMutations.saveProfile());
  const isInterested = me.preferredCategories.includes(theme);

  const toggleInterest = () => {
    const preferredCategories = isInterested
      ? me.preferredCategories.filter(category => category !== theme)
      : [...me.preferredCategories, theme];

    saveProfile({ patch: { preferredCategories }, image: null });
  };

  return (
    <FlatList
      data={spots}
      keyExtractor={spot => spot.contentId}
      contentContainerStyle={[styles.list, spots.length === 0 && styles.emptyList]}
      ListHeaderComponent={
        <View style={styles.themeHeader}>
          <Text typography="t6" weight="semiBold">
            {t(`spot.theme.names.${theme}`)}
          </Text>
          <Button
            size="tiny"
            type={isInterested ? 'light' : 'primary'}
            onPress={toggleInterest}
            loading={isPending}
          >
            {t(isInterested ? 'spot.theme.result.removeInterest' : 'spot.theme.result.addInterest')}
          </Button>
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
  );
}

function ThemeSpotListItem({ spot, onPress }: { spot: ThemeSpot; onPress: () => void }) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={styles.item}>
      <Image
        source={spot.imageUrl ? { uri: spot.imageUrl } : placeholderImage}
        style={styles.image}
      />
      <View style={styles.itemContent}>
        <Text typography="t7" weight="bold" numberOfLines={1}>
          {spot.title}
        </Text>
        <Text typography="st13" weight="semiBold" color={colors.grey[500]} numberOfLines={1}>
          {spot.regionName}
          {spot.quietnessScore != null &&
            ` · ${t('spot.theme.result.quietness', {
              score: formatQuietness(spot.quietnessScore),
            })}`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingBottom: 24,
    gap: 12,
  },
  emptyList: {
    flexGrow: 1,
  },
  skeleton: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
  themeHeader: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    minHeight: 70,
    flexDirection: 'row',
    gap: 11,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
});
