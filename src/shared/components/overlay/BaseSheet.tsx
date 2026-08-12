import { type ComponentRef, type ReactNode, type Ref } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
  type BottomSheetProps,
} from '@gorhom/bottom-sheet';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_BOTTOM, SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { useMainTabBarSpace } from '@/shared/hooks/useMainTabBarSpace';

function SheetBackdrop(backdropProps: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} />;
}

interface BaseSheetProps
  extends Omit<
    BottomSheetProps,
    'children' | 'handleIndicatorStyle' | 'backgroundStyle' | 'backdropComponent'
  > {
  /**
   * 메인탭 화면에서 하단 탭바 높이만큼 콘텐츠 아래 여백 확보(메인탭에서 사용할때만 명시적으로 true)
   * @default false
   */
  avoidMainTabBar?: boolean;
  /**
   * 뒤쪽을 어둡게 덮고 탭을 막는다. 지도처럼 뒤쪽을 계속 조작해야 하면 false
   * @default true
   */
  withBackdrop?: boolean;
  children: ReactNode;
  ref?: Ref<ComponentRef<typeof BottomSheet>>;
}

export default function BaseSheet({
  avoidMainTabBar = false,
  withBackdrop = true,
  children,
  ref,
  ...bottomSheetProps
}: BaseSheetProps) {
  // 시트는 SafeArea 밖에서 물리 화면 바닥에 붙으므로 시스템 네비 인셋까지 포함
  const mainTabBarSpace = useMainTabBarSpace({ fromPhysicalBottom: true });
  const { bottom } = useSafeAreaInsets();

  return (
    <BottomSheet
      ref={ref}
      enablePanDownToClose
      handleStyle={styles.handleContainer}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.background}
      backdropComponent={withBackdrop ? SheetBackdrop : undefined}
      {...bottomSheetProps}
    >
      {/* 콘텐츠가 시트 최대 높이(화면)를 넘으면 잘리는 대신 시트 안에서 스크롤 */}
      <BottomSheetScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: avoidMainTabBar ? mainTabBarSpace : SCREEN_PADDING_BOTTOM + bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  handleContainer: {
    paddingBottom: 0, // 아래 간격은 content 쪽에서만 관리
  },
  // 시트 위쪽 손잡이(pill 인디케이터)
  handle: {
    backgroundColor: colors.grey[300],
    width: 36,
  },
  // 시트 몸통
  background: {
    borderRadius: 40,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 12,
  },
  content: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 14,
  },
});
