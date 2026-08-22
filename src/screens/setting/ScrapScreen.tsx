import { Suspense } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Layout, StackHeader } from '@/shared/components/layout';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { Text } from '@/shared/components/base';
import { EmptyState } from '@/shared/components/ui';
import { spotMutations, spotQueries } from '@/domains/spot/api/queries';
import { SpotListItem } from '@/domains/spot/components';
import { ArchiveTickOutlineIcon } from '@/assets/icons/common';
import { ScrapSkeleton } from './components';

export default function ScrapScreen() {
  const { t } = useTranslation();

  return (
    <Layout>
      <StackHeader title={t('setting.scrap')} />
      <Suspense
        fallback={
          <View style={styles.placeholder}>
            <ScrapSkeleton />
          </View>
        }
      >
        <ScrapList />
      </Suspense>
    </Layout>
  );
}

function ScrapList() {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { data: scraps } = useSuspenseQuery(spotQueries.getScraps({ type: 'SPOT' }));
  const { mutate: deleteScrap } = useMutation(spotMutations.deleteScrap());

  if (scraps.length === 0) {
    return (
      <View style={styles.placeholder}>
        <EmptyState
          icon={ArchiveTickOutlineIcon}
          title={t('spot.scrap.empty.title')}
          description={t('spot.scrap.empty.description')}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={scraps}
      keyExtractor={scrap => String(scrap.id)}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <Text typography="t6" weight="semiBold">
          {t('setting.scrapCount', { count: scraps.length })}
        </Text>
      }
      renderItem={({ item }) => (
        <SpotListItem
          name={item.title}
          region={item.regionName}
          quietness={item.quietnessScore}
          imageUrl={item.imageUrl}
          isScrapped
          onPressItem={() => navigate('SpotDetail', { contentId: item.contentId })}
          onPressScrap={() => deleteScrap({ contentId: item.contentId })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: 12,
  },
  placeholder: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
});
