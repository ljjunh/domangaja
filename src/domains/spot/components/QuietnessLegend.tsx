import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { QUIETNESS_LEVEL_COLORS, type QuietnessLevel } from '../constants/quietness';

// 표시 순서 — 한적한 쪽부터
const QUIETNESS_LEVELS: QuietnessLevel[] = ['quiet', 'normal', 'crowded'];

const DOT_SIZE = 12;

// 배경(흰 카드 / 지도 위 알약)은 배치하는 쪽이 입힌다
export default function QuietnessLegend() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {QUIETNESS_LEVELS.map(level => (
        <View key={level} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: QUIETNESS_LEVEL_COLORS[level].ink }]} />
          <Text typography="st12" weight="medium">
            {t(`spot.quietnessLevel.${level}`)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: 4,
  },
});
