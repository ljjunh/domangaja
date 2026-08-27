import { Suspense } from 'react';
import { ImageBackground, Share, ScrollView, StyleSheet, View } from 'react-native';
import { type StaticScreenProps } from '@react-navigation/native';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  ArchiveTickFillIcon,
  ArchiveTickOutlineIcon,
  ExportIcon,
  LocationFillIcon,
} from '@/assets/icons/common';
import { placeholderImage } from '@/assets/images';
import { audioGuideQueries } from '@/domains/audioGuide/api/queries';
import { SpotAudioGuide } from '@/domains/audioGuide/components';
import { matchAudioGuides } from '@/domains/audioGuide/utils/matchAudioGuide';
import { spotMutations, spotQueries } from '@/domains/spot/api/queries';
import { SpotContactActions } from '@/domains/spot/components';
import { toSpotDetailViewData } from '@/domains/spot/utils/spotDetail';
import { Text } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { ExpandableText, IconButton } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import type { ServerLocale } from '@/shared/i18n/serverLocale';
import { SpotDetailSkeleton } from './components';
import { GetSpotDetailResponse } from '@/domains/spot/types/api';

type SpotDetailParams = {
  contentId: GetSpotDetailResponse['contentId'];
  lang?: ServerLocale;
};

type Props = StaticScreenProps<SpotDetailParams>;

export default function SpotDetailScreen({ route }: Props) {
  return (
    <Suspense fallback={<SpotDetailSkeleton />}>
      <SpotDetailContent contentId={route.params.contentId} lang={route.params.lang} />
    </Suspense>
  );
}

function SpotDetailContent({ contentId, lang }: SpotDetailParams) {
  const { t, i18n } = useTranslation();
  const { data: spot } = useSuspenseQuery(spotQueries.getSpotDetail({ contentId, lang }));
  const { data: audioGuides = [] } = useQuery({
    ...audioGuideQueries.getNearby({
      lat: spot.latitude,
      lng: spot.longitude,
      radius: 500,
      langCode: i18n.language,
    }),
  });
  // TODO: useSpotScrap, SpotScrapButton으로 추출 후 재사용 검토
  const { mutate: createScrap, isPending: isCreatingScrap } = useMutation(
    spotMutations.createScrap(),
  );
  const { mutate: deleteScrap, isPending: isDeletingScrap } = useMutation(
    spotMutations.deleteScrap(),
  );

  const detail = toSpotDetailViewData(spot);
  const matchedAudioGuides = matchAudioGuides(detail, audioGuides);
  const isScrapPending = isCreatingScrap || isDeletingScrap;

  const toggleScrap = () => {
    if (spot.scrapped) {
      deleteScrap({ contentId: detail.contentId });
      return;
    }

    createScrap({ contentId: detail.contentId });
  };

  const shareSpot = () => {
    const shareUrl = `domangaja://spots/${encodeURIComponent(detail.contentId)}`;

    return Share.share({
      title: detail.title,
      message: [detail.title, detail.address, shareUrl].filter(Boolean).join('\n'),
      url: shareUrl,
    });
  };

  return (
    <Layout edges={['top']}>
      <StackHeader
        right={
          <>
            <IconButton
              icon={spot.scrapped ? ArchiveTickFillIcon : ArchiveTickOutlineIcon}
              color={spot.scrapped ? colors.blue[500] : colors.black}
              label={spot.scrapped ? t('spot.detail.unscrap') : t('spot.detail.scrap')}
              disabled={isScrapPending}
              onPress={toggleScrap}
            />
            <IconButton icon={ExportIcon} label={t('spot.detail.share')} onPress={shareSpot} />
          </>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={detail.imageUrl ? { uri: detail.imageUrl } : placeholderImage}
          style={styles.hero}
          imageStyle={styles.heroImage}
        />
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text typography="t3" weight="bold">
                {detail.title}
              </Text>
              <Text typography="t6" color={colors.grey[800]}>
                {t(detail.contentTypeLabelKey)}
              </Text>
            </View>
            {detail.address && (
              <View style={styles.regionRow}>
                <LocationFillIcon width={16} height={16} color={colors.grey[500]} />
                <Text typography="t6" color={colors.grey[800]}>
                  {detail.address}
                </Text>
              </View>
            )}
          </View>
          {matchedAudioGuides.length > 0 && <SpotAudioGuide guides={matchedAudioGuides} />}
          {detail.overview && <ExpandableText key={detail.overview} text={detail.overview} />}
          <SpotContactActions homepageUrl={detail.homepageUrl} tel={detail.tel} />
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    height: 260,
    marginHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
  heroImage: {
    backgroundColor: colors.grey[100],
    borderRadius: 12,
  },
  content: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 20,
    gap: 16,
  },
  titleSection: {
    gap: 7,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
