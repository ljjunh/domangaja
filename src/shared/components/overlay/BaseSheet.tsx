import { type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView, type BottomSheetProps } from '@gorhom/bottom-sheet';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { useMainTabBarSpace } from '@/shared/hooks/useMainTabBarSpace';

interface BaseSheetProps
  extends Omit<BottomSheetProps, 'children' | 'handleIndicatorStyle' | 'backgroundStyle'> {
  /**
   * 메인탭 화면에서 하단 탭바 높이만큼 콘텐츠 아래 여백 확보(메인탭에서 사용할때만 명시적으로 true)
   * @default false
   */
  avoidMainTabBar?: boolean;
  children: ReactNode;
}

export default function BaseSheet({
  avoidMainTabBar = false,
  children,
  ...bottomSheetProps
}: BaseSheetProps) {
  const mainTabBarSpace = useMainTabBarSpace();

  return (
    <BottomSheet
      enablePanDownToClose
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.background}
      {...bottomSheetProps}
    >
      <BottomSheetView
        style={[styles.content, avoidMainTabBar && { paddingBottom: mainTabBarSpace }]}
      >
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: 4,
  },
});
