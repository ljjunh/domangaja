import { type ReactNode } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Text } from '@/shared/components/base';
import { ExpandableText } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { toServerLocale } from '@/shared/i18n/serverLocale';
import { spotQueries } from '@/domains/spot/api/queries';
import { toSpotDetailViewData } from '@/domains/spot/utils/spotDetail';
import SpotContactActions from './SpotContactActions';

interface SpotTourInfoProps {
  contentId: string;
  /**
   * 오디오 가이드는 audioGuide 도메인 데이터라 여기서 직접 못 가져온다
   * (도메인끼리 참조 금지) — 화면이 만들어 넣어준다
   */
  audioGuide?: ReactNode;
}

export default function SpotTourInfo({ contentId, audioGuide }: SpotTourInfoProps) {
  const { t, i18n } = useTranslation();
  // 시트 안이라 Suspense 경계가 없다 — 도착 전에는 아무것도 그리지 않는다.
  // 탭을 눌렀을 때만 마운트되므로 캘린더만 보고 닫으면 요청도 안 나간다
  const { data: spot, isPending } = useQuery(
    spotQueries.getSpotDetail({ contentId, lang: toServerLocale(i18n.language) }),
  );

  if (isPending) {
    return null;
  }

  const detail = spot == null ? null : toSpotDetailViewData(spot);

  return (
    <View style={styles.container}>
      {/* imageUrl -> thumbnailUrl 폴백까지 실패하면 빈 칸을 남기지 않고 아예 뺀다 */}
      {detail?.imageUrl != null && (
        <ImageBackground
          source={{ uri: detail.imageUrl }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        />
      )}
      {/* KTO에 소개글이 없는 관광지가 있다 */}
      {detail?.overview == null ? (
        <Text typography="t6" weight="medium" color={colors.grey[700]}>
          {t('spotSheet.emptyTourInfo')}
        </Text>
      ) : (
        <ExpandableText key={detail.overview} text={detail.overview} />
      )}
      {detail != null && <SpotContactActions homepageUrl={detail.homepageUrl} tel={detail.tel} />}
      {audioGuide}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingBottom: 10,
  },
  hero: {
    height: 160,
  },
  heroImage: {
    backgroundColor: colors.grey[100],
    borderRadius: 12,
  },
});
