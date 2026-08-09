import { StyleSheet, View } from 'react-native';
import { colors } from '@/shared/constants/colors';

interface StoryProgressBarProps {
  /**
   * 0~1 사이 진행률. 지금은 정적인 값만 표시하며,
   * 추후 자동 재생 로직이 실시간으로 갱신할 값을 받는 자리
   */
  progress: number;
}

export default function StoryProgressBar({ progress }: StoryProgressBarProps) {
  const width: `${number}%` = `${Math.min(Math.max(progress, 0), 1) * 100}%`;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.greyOpacity[400],
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.white,
  },
});
