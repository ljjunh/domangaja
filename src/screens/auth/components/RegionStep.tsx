import { useState } from 'react';
import { ImageBackground, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { SPRING } from '@/shared/constants/springs';
import { DoneIcon } from '@/assets/icons/common';
import { example1Image, example2Image } from '@/assets/images';
import TypingTitle from './TypingTitle';
import { stepEntering } from '../utils/stepEntering';
import { Button } from '@/shared/components/ui';

// TODO: 서버 연동 시 지역/풍경 목록 응답으로 대체 (다국어 처리 예정)
const REGIONS = ['서울', '강원', '충청', '전라', '경상', '제주'];

// TODO: 디자인 확정 시 풍경별 실제 이미지로 교체
const LANDSCAPES: { key: string; label: string; image: ImageSourcePropType }[] = [
  { key: 'beach', label: '바다 · 해변', image: example1Image },
  { key: 'forest', label: '숲 · 산', image: example2Image },
  { key: 'island', label: '섬', image: example1Image },
  { key: 'field', label: '들판 · 시골', image: example2Image },
  { key: 'night', label: '별 · 밤하늘', image: example1Image },
  { key: 'valley', label: '계곡 · 물', image: example2Image },
];

// 있으면 빼고, 없으면 넣는 다중 선택 토글
function toggleSelection(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter(item => item !== value) : [...list, value];
}

// 누를 때 살짝 커졌다 스프링으로 돌아오는 팝 효과
function usePressPop(peakScale = 1.08) {
  const scale = useSharedValue(1);

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pop = () => {
    scale.value = withSequence(
      withTiming(peakScale, { duration: 80 }),
      withSpring(1, SPRING.quick),
    );
  };

  return { popStyle, pop };
}

interface RegionChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

function RegionChip({ label, isSelected, onPress }: RegionChipProps) {
  const { popStyle, pop } = usePressPop();

  return (
    <Animated.View style={popStyle}>
      <Pressable
        style={[styles.chip, isSelected && styles.chipSelected]}
        onPress={() => {
          pop();
          onPress();
        }}
      >
        <Text
          typography="t7"
          weight="semiBold"
          color={isSelected ? colors.white : colors.grey[600]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

interface LandscapeCardProps {
  label: string;
  image: ImageSourcePropType;
  isSelected: boolean;
  onPress: () => void;
}

function LandscapeCard({ label, image, isSelected, onPress }: LandscapeCardProps) {
  // 카드는 면적이 커서 팝을 얕게
  const { popStyle, pop } = usePressPop(1.04);

  return (
    <Animated.View style={[styles.cardWrapper, popStyle]}>
      <Pressable
        style={styles.card}
        onPress={() => {
          pop();
          onPress();
        }}
      >
        <ImageBackground source={image} fadeDuration={0} style={styles.cardImage}>
          {isSelected && (
            <View style={styles.checkBadge}>
              <DoneIcon width={12} height={12} color={colors.white} />
            </View>
          )}
          <Text typography="t6" weight="semiBold" color={colors.white}>
            {label}
          </Text>
        </ImageBackground>
        {isSelected && <View style={styles.selectedBorder} pointerEvents="none" />}
      </Pressable>
    </Animated.View>
  );
}

export type RegionSelection = {
  regions: string[];
  landscapes: string[];
};

interface RegionStepProps {
  onNext: (selection: RegionSelection) => void;
  /**
   * 제출 진행 중 — 시작하기 버튼 잠금 (중복 제출 방지)
   * @default false
   */
  isSubmitting?: boolean;
}

export default function RegionStep({ onNext, isSubmitting = false }: RegionStepProps) {
  const [isTitleDone, setIsTitleDone] = useState(false);
  const [regions, setRegions] = useState<string[]>([]);
  const [landscapes, setLandscapes] = useState<string[]>([]);

  return (
    <View style={styles.container}>
      {/* TODO: 다국어 처리 예정 */}
      <TypingTitle text={'어디로\n도망가고 싶어요?'} onComplete={() => setIsTitleDone(true)} />

      {isTitleDone && (
        <>
          <Animated.View entering={stepEntering()} style={styles.section}>
            <Text typography="t6" weight="medium" color={colors.grey[600]}>
              관심지역을 골라두면 먼저 보여드려요.
            </Text>
            <View style={styles.chipRow}>
              {REGIONS.map(region => (
                <RegionChip
                  key={region}
                  label={region}
                  isSelected={regions.includes(region)}
                  onPress={() => setRegions(prev => toggleSelection(prev, region))}
                />
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={stepEntering(100)} style={styles.section}>
            <Text typography="t5" weight="semiBold">
              어떤 풍경을 좋아하세요?
            </Text>
            <View style={styles.cardGrid}>
              {LANDSCAPES.map(landscape => (
                <LandscapeCard
                  key={landscape.key}
                  label={landscape.label}
                  image={landscape.image}
                  isSelected={landscapes.includes(landscape.key)}
                  onPress={() => setLandscapes(prev => toggleSelection(prev, landscape.key))}
                />
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={stepEntering(200)} style={styles.startButtonArea}>
            <Button
              display="block"
              loading={isSubmitting}
              onPress={() => onNext({ regions, landscapes })}
            >
              시작하기
            </Button>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  section: {
    gap: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grey[200],
    backgroundColor: colors.white,
  },
  chipSelected: {
    borderColor: colors.blue[500],
    backgroundColor: colors.blue[500],
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cardWrapper: {
    flexBasis: '48%',
    flexGrow: 1,
  },
  card: {
    aspectRatio: 1.6,
    borderRadius: 14,
    overflow: 'hidden',
  },
  selectedBorder: {
    ...StyleSheet.absoluteFill,
    borderWidth: 2,
    borderColor: colors.blue[500],
    borderRadius: 14,
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.blue[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonArea: {
    marginTop: 'auto',
  },
});
