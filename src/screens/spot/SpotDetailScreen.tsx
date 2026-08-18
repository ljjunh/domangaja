import { Suspense } from 'react';
import { ImageBackground, Share, ScrollView, StyleSheet, View } from 'react-native';
import { type StaticScreenProps } from '@react-navigation/native';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { LocationFillIcon, ExportIcon } from '@/assets/icons/common';
import { example1Image } from '@/assets/images';
import { audioGuideQueries } from '@/domains/audioGuide/api/queries';
import { SpotAudioGuide } from '@/domains/audioGuide/components';
import { matchAudioGuides } from '@/domains/audioGuide/utils/matchAudioGuide';
import { spotQueries } from '@/domains/spot/api/queries';
import { toSpotDetailViewData } from '@/domains/spot/utils/spotDetail';
import { Text } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { IconButton } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { toServerLocale } from '@/shared/i18n/serverLocale';
import { ExpandableOverview, SpotContactActions, SpotDetailSkeleton } from './components';
import { GetSpotDetailResponse } from '@/domains/spot/types/api';

type Props = StaticScreenProps<{ contentId: GetSpotDetailResponse['contentId'] }>;

export default function SpotDetailScreen({ route }: Props) {
  return (
    <Suspense fallback={<SpotDetailSkeleton />}>
      <SpotDetailContent contentId={route.params.contentId} />
    </Suspense>
  );
}

function SpotDetailContent({ contentId }: { contentId: GetSpotDetailResponse['contentId'] }) {
  const { i18n } = useTranslation();
  const { data: spot } = useSuspenseQuery(
    spotQueries.getSpotDetail({
      contentId,
      lang: toServerLocale(i18n.language),
    }),
  );
  const { data: audioGuides = [] } = useQuery({
    ...audioGuideQueries.getNearby({
      lat: spot.latitude,
      lng: spot.longitude,
      radius: 500,
      langCode: i18n.language,
    }),
  });

  const detail = toSpotDetailViewData(spot);
  const matchedAudioGuides = matchAudioGuides(detail, audioGuides);

  // TODO: 상세 조회시 response에 스크랩 여부 확인 불가 서버에 요청하기
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
      <StackHeader right={<IconButton icon={ExportIcon} label="공유" onPress={shareSpot} />} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={detail.imageUrl ? { uri: detail.imageUrl } : example1Image}
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
                {detail.contentTypeLabel}
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
          {detail.overview && (
            <ExpandableOverview key={detail.overview} overview={detail.overview} />
          )}
          <SpotContactActions homepageUrl={detail.homepageUrl} tel={detail.tel} />
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  hero: { height: 260, marginHorizontal: SCREEN_PADDING_HORIZONTAL },
  heroImage: { backgroundColor: colors.grey[100], borderRadius: 12 },
  content: { paddingHorizontal: SCREEN_PADDING_HORIZONTAL, paddingTop: 20, gap: 16 },
  titleSection: { gap: 7 },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  regionRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
