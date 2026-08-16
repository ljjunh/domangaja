import { useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Linking,
  Share,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { type StaticScreenProps } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  ArchiveTickFillIcon,
  ArchiveTickOutlineIcon,
  LocationFillIcon,
  PlayFillIcon,
  ExportIcon,
} from '@/assets/icons/common';
import { example1Image } from '@/assets/images';
import { spotQueries } from '@/domains/spot/api/queries';
import { getSpotContentTypeLabel } from '@/domains/spot/constants/contentType';
import { Pressable, Text } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { IconButton } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
// TODO: 서버 로케일 변환 유틸 전역 관리 검토
import { toServerLocale } from '@/domains/user/utils/serverLocale';

type Props = StaticScreenProps<{ contentId: string }>;

function hasText(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function toPlainText(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim();
}

function getHomepageUrl(value: string): string | null {
  const href = value.match(/href=["']([^"']+)["']/i)?.[1];
  const candidate = (href ?? toPlainText(value)).trim();
  if (!candidate) return null;
  return /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
}

export default function SpotDetailScreen({ route }: Props) {
  const { i18n } = useTranslation();
  const [isScrapped, setIsScrapped] = useState(false);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [canExpandOverview, setCanExpandOverview] = useState(false);
  const {
    data: spot,
    isPending,
    isError,
    refetch,
  } = useQuery(spotQueries.getSpotDetail(route.params.contentId, toServerLocale(i18n.language)));

  if (isPending) {
    return (
      <Layout>
        <StackHeader />
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={colors.blue[500]} />
        </View>
      </Layout>
    );
  }

  if (isError || spot == null) {
    return (
      <Layout>
        <StackHeader />
        <View style={styles.stateContainer}>
          <Text typography="t6" weight="semiBold">
            장소 정보를 불러오지 못했어요
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text typography="st11" weight="semiBold" color={colors.blue[600]}>
              다시 시도
            </Text>
          </Pressable>
        </View>
      </Layout>
    );
  }

  const imageUrl = hasText(spot.imageUrl)
    ? spot.imageUrl.trim()
    : hasText(spot.thumbnailUrl)
    ? spot.thumbnailUrl.trim()
    : null;
  const overview = hasText(spot.overview) ? toPlainText(spot.overview) : null;
  const homepageUrl = hasText(spot.homepage) ? getHomepageUrl(spot.homepage) : null;
  const tel = hasText(spot.tel) ? toPlainText(spot.tel) : null;
  const address = hasText(spot.address) ? toPlainText(spot.address) : null;
  const contentTypeLabel = getSpotContentTypeLabel(spot.contentTypeId);
  const shareSpot = () =>
    Share.share({
      title: spot.title,
      message: [spot.title, address, homepageUrl].filter(Boolean).join('\n'),
      ...(homepageUrl ? { url: homepageUrl } : null),
    });

  return (
    <Layout edges={['top']}>
      <StackHeader
        right={
          <>
            <IconButton
              icon={isScrapped ? ArchiveTickFillIcon : ArchiveTickOutlineIcon}
              color={isScrapped ? colors.blue[500] : colors.black}
              label={isScrapped ? '스크랩 해제' : '스크랩'}
              onPress={() => setIsScrapped(value => !value)}
            />
            <IconButton icon={ExportIcon} label="공유" onPress={shareSpot} />
          </>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={imageUrl ? { uri: imageUrl } : example1Image}
          style={styles.hero}
          imageStyle={styles.heroImage}
        />

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text typography="t3" weight="bold">
                {spot.title}
              </Text>
              <Text typography="t6" weight="medium" color={colors.grey[600]}>
                {contentTypeLabel}
              </Text>
            </View>
            {address && (
              <View style={styles.regionRow}>
                <LocationFillIcon width={16} height={16} color={colors.grey[500]} />
                <Text typography="st11" weight="medium" color={colors.grey[600]}>
                  {address}
                  {hasText(spot.zipcode) ? ` (${spot.zipcode.trim()})` : ''}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.audioGuideCard}>
            <View style={styles.playButton}>
              <PlayFillIcon width={28} height={28} color={colors.white} />
            </View>
            <View style={styles.audioGuideText}>
              <Text typography="t7" weight="semiBold">
                오디오 가이드
              </Text>
              <Text typography="st12" weight="medium" color={colors.grey[500]}>
                준비 중
              </Text>
            </View>
          </View>

          {overview && (
            <View style={styles.overviewCard}>
              <Text
                accessible={false}
                typography="st11"
                style={[styles.description, styles.measureText]}
                onTextLayout={event => {
                  const isExpandable = event.nativeEvent.lines.length > 3;
                  setCanExpandOverview(current =>
                    current === isExpandable ? current : isExpandable,
                  );
                }}
              >
                {overview}
              </Text>
              <Text
                typography="st11"
                color={colors.grey[900]}
                style={styles.description}
                numberOfLines={isOverviewExpanded ? undefined : 3}
                ellipsizeMode="clip"
              >
                {overview}
              </Text>
              {canExpandOverview && (
                <Pressable
                  style={styles.moreButton}
                  onPress={() => setIsOverviewExpanded(value => !value)}
                >
                  <Text typography="st11" weight="medium" color={colors.grey[500]}>
                    {isOverviewExpanded ? '접기' : '더보기'}
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {(homepageUrl || tel) && (
            <View style={styles.actionRow}>
              {homepageUrl && (
                <Pressable
                  style={[styles.actionButton, !tel && styles.fullWidthAction]}
                  onPress={() => Linking.openURL(homepageUrl)}
                >
                  <Text typography="t7" weight="semiBold" color={colors.blue[600]}>
                    홈페이지 방문
                  </Text>
                </Pressable>
              )}
              {tel && (
                <Pressable
                  style={[styles.actionButton, !homepageUrl && styles.fullWidthAction]}
                  onPress={() => Linking.openURL(`tel:${tel.replace(/[^\d+]/g, '')}`)}
                >
                  <Text typography="t7" weight="semiBold" color={colors.blue[600]}>
                    전화 문의
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  stateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colors.blue[50],
  },
  scrollContent: { paddingBottom: 40 },
  hero: { height: 260, marginHorizontal: SCREEN_PADDING_HORIZONTAL },
  heroImage: { backgroundColor: colors.grey[100], borderRadius: 12 },
  content: { paddingHorizontal: SCREEN_PADDING_HORIZONTAL, paddingTop: 20, gap: 16 },
  titleSection: { gap: 7 },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  regionRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.grey[100],
  },
  fullWidthAction: { flex: 1 },
  audioGuideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.grey[100],
  },
  playButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.blue[500],
  },
  audioGuideText: { gap: 1 },
  overviewCard: {
    position: 'relative',
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.grey[100],
  },
  description: { lineHeight: 23 },
  measureText: { position: 'absolute', left: 14, right: 14, opacity: 0 },
  moreButton: {
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.grey[200],
  },
});
