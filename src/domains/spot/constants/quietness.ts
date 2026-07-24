import { colors } from '@/shared/constants/colors';

export type QuietnessLevel = 'quiet' | 'normal' | 'crowded';

// 경계값은 임시 — 기획 확정 시 조정
export function getQuietnessLevel(quietness: number): QuietnessLevel {
  if (quietness >= 70) return 'quiet';
  if (quietness >= 40) return 'normal';
  return 'crowded';
}

export const QUIETNESS_LEVEL_COLORS: Record<QuietnessLevel, string> = {
  quiet: colors.green[500],
  normal: colors.yellow[500],
  crowded: colors.red[500],
};
