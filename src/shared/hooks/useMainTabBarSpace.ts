import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IS_IOS } from '@/shared/constants/platform';
import { MAIN_TAB_BAR_BOTTOM_GAP, MAIN_TAB_BAR_HEIGHT } from '@/shared/constants/layout';

const MAIN_TAB_BAR_TOP_GAP = 12;

export const useMainTabBarSpace = () => {
  const { bottom } = useSafeAreaInsets();

  // iOS: edges에 bottom이 없어 뷰포트가 기기 바닥까지 -> 인셋을 여기서 더함
  // Android: bottom edge를 처리해 뷰포트가 시스템 네비 위에서 끝남 -> 갭만 더함
  return IS_IOS
    ? MAIN_TAB_BAR_HEIGHT + bottom + MAIN_TAB_BAR_TOP_GAP
    : MAIN_TAB_BAR_HEIGHT + MAIN_TAB_BAR_BOTTOM_GAP + MAIN_TAB_BAR_TOP_GAP;
};
