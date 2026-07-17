import type { Edge } from 'react-native-safe-area-context';
import { IS_IOS } from '@/shared/constants/platform';

export const SCREEN_PADDING_HORIZONTAL = 15;
export const SCREEN_PADDING_BOTTOM = 12;
export const MAIN_TAB_BAR_HEIGHT = 58;
export const MAIN_TAB_BAR_BOTTOM_GAP = 8;
export const MAIN_TAB_SCREEN_EDGES: readonly Edge[] = IS_IOS ? ['top'] : ['top', 'bottom'];
