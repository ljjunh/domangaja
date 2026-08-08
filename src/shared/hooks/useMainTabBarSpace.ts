import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IS_IOS } from '@/shared/constants/platform';
import { MAIN_TAB_BAR_BOTTOM_GAP, MAIN_TAB_BAR_HEIGHT } from '@/shared/constants/layout';

// 콘텐츠와 탭바 사이 여백
const MAIN_TAB_BAR_TOP_GAP = 12;

interface MainTabBarSpaceOptions {
  /**
   * 어느 바닥에서 재기 시작할지 (Android에서만 차이 발생)
   * - false(기본): SafeArea가 bottom을 처리한 뷰포트 바닥 기준 — Layout 안의 스크롤 콘텐츠용
   * - true: 물리 화면 바닥 기준 — 바텀시트처럼 SafeArea 밖에서 바닥에 붙는 요소용
   */
  fromPhysicalBottom?: boolean;
}

/**
 * 떠 있는 메인 탭바에 가려지지 않기 위해 필요한 하단 공간.
 * 화면 맨 아래 콘텐츠의 paddingBottom 등으로 사용한다.
 *
 * 구성 요소:
 * - MAIN_TAB_BAR_HEIGHT: 탭바 자체 높이
 * - MAIN_TAB_BAR_TOP_GAP: 콘텐츠가 탭바에 딱 붙지 않도록 주는 탭바 상단 여백
 * - MAIN_TAB_BAR_BOTTOM_GAP: 탭바와 시스템 네비 사이 간격 (Android에서 탭바를 띄우는 값)
 * - bottom: 시스템이 차지하는 하단 인셋 (iOS 홈 인디케이터 / Android 내비게이션 바)
 */
export const useMainTabBarSpace = ({ fromPhysicalBottom = false }: MainTabBarSpaceOptions = {}) => {
  const { bottom } = useSafeAreaInsets();

  // iOS: 메인탭 화면 edges에 bottom이 없어 뷰포트가 물리 바닥까지 내려옴
  // -> 두 기준이 같은 지점이라 옵션 구분 없이 인셋을 항상 더한다
  if (IS_IOS) {
    return MAIN_TAB_BAR_HEIGHT + MAIN_TAB_BAR_TOP_GAP + bottom;
  }

  // Android: 탭바가 시스템 네비 위에 BOTTOM_GAP만큼 띄워져 있다
  // - SafeArea 안(기본): 뷰포트가 이미 네비 위에서 끝나므로 인셋 제외
  // - SafeArea 밖(fromPhysicalBottom): 네비 뒤까지 그려지므로 인셋까지 더해야 탭바 위에서 끝남
  return (
    MAIN_TAB_BAR_HEIGHT +
    MAIN_TAB_BAR_BOTTOM_GAP +
    MAIN_TAB_BAR_TOP_GAP +
    (fromPhysicalBottom ? bottom : 0)
  );
};
