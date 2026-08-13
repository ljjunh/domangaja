import { StyleSheet, View } from 'react-native';
import { AnimateSkeleton, Skeleton } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';

// 실제 컴포넌트에서 그대로 가져온 치수
const SECTION_TITLE_HEIGHT = 22.5;
const SEE_ALL_WIDTH = 32;
const SEE_ALL_HEIGHT = 16.5;
const CARD_SIZE = 140;
const LIST_ITEM_IMAGE_SIZE = 70;
const QUICK_MENU_ICON_SIZE = 24;
const QUICK_MENU_LABEL_HEIGHT = 18;
const NEARBY_BANNER_HEIGHT = 72;
const HORIZONTAL_CARD_COUNT = 3;
const RECENT_ITEM_COUNT = 3;

export default function HomeSkeleton() {
  return (
    <AnimateSkeleton delay={500} withGradient={false} withShimmer={true}>
      <View style={styles.container}>
        <Skeleton height={undefined} borderRadius={12} style={styles.todayBanner} />

        <QuickMenuSkeleton />
        <HorizontalCardSectionSkeleton />
        <NearbySpotBannerSkeleton />
        <HorizontalCardSectionSkeleton />
        <RecentSpotSectionSkeleton />
      </View>
    </AnimateSkeleton>
  );
}

function SectionHeaderSkeleton() {
  return (
    <View style={styles.sectionHeader}>
      <Skeleton width={120} height={SECTION_TITLE_HEIGHT} />
      <Skeleton width={SEE_ALL_WIDTH} height={SEE_ALL_HEIGHT} style={styles.seeAll} />
    </View>
  );
}

function HorizontalCardSectionSkeleton() {
  return (
    <View style={styles.section}>
      <SectionHeaderSkeleton />
      <View style={styles.cardList}>
        {Array.from({ length: HORIZONTAL_CARD_COUNT }, (_, index) => (
          <Skeleton key={index} width={CARD_SIZE} height={CARD_SIZE} borderRadius={12} />
        ))}
      </View>
    </View>
  );
}

function RecentSpotSectionSkeleton() {
  return (
    <View style={styles.section}>
      <SectionHeaderSkeleton />
      <View style={styles.recentList}>
        {Array.from({ length: RECENT_ITEM_COUNT }, (_, index) => (
          <View key={index} style={styles.recentItem}>
            <Skeleton
              width={LIST_ITEM_IMAGE_SIZE}
              height={LIST_ITEM_IMAGE_SIZE}
              borderRadius={12}
            />
            <View style={styles.recentItemInfo}>
              <Skeleton width={140} height={19.5} />
              <Skeleton width={100} height={16.5} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function QuickMenuSkeleton() {
  return (
    <View style={styles.quickMenu}>
      {Array.from({ length: 4 }, (_, index) => (
        <View key={index} style={styles.quickMenuItem}>
          <Skeleton
            width={QUICK_MENU_ICON_SIZE}
            height={QUICK_MENU_ICON_SIZE}
            borderRadius={QUICK_MENU_ICON_SIZE / 2}
          />
          <Skeleton width={56} height={QUICK_MENU_LABEL_HEIGHT} />
        </View>
      ))}
    </View>
  );
}

function NearbySpotBannerSkeleton() {
  return <Skeleton height={NEARBY_BANNER_HEIGHT} borderRadius={24} />;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: 16,
  },
  todayBanner: {
    alignSelf: 'stretch',
    aspectRatio: 345 / 170,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seeAll: {
    alignSelf: 'flex-end',
  },
  cardList: {
    flexDirection: 'row',
    gap: 12,
    overflow: 'hidden',
  },
  recentList: {
    gap: 10,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  recentItemInfo: {
    gap: 4,
  },
  quickMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  quickMenuItem: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
  },
});
