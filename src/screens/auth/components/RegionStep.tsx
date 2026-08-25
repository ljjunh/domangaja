import { useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Pressable, Text } from '@/shared/components/base';
import { useTranslation } from 'react-i18next';
import type { PreferredRegion } from '@/domains/user/types/api';
import { ONBOARDING_SPOT_THEMES, type SpotTheme } from '@/shared/types/spotTheme';
import { colors } from '@/shared/constants/colors';
import { SPRING } from '@/shared/constants/springs';
import { DoneIcon } from '@/assets/icons/common';
import { SPOT_THEME_IMAGES } from '@/assets/images/spotTheme';
import TypingTitle from './TypingTitle';
import { stepEntering } from '../utils/stepEntering';
import { Button } from '@/shared/components/ui';

// 표시 이름은 로케일(region.names)에 있고 여기선 순서만 정한다
const REGIONS: PreferredRegion[] = [
  'SEOUL',
  'GANGWON',
  'CHUNGCHEONG',
  'JEOLLA',
  'GYEONGSANG',
  'JEJU',
];

// 있으면 빼고, 없으면 넣는 다중 선택 토글
function toggleSelection<T>(list: T[], value: T): T[] {
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
          <View style={styles.labelPill}>
            <Text typography="t6" weight="semiBold" color={colors.white}>
              {label}
            </Text>
          </View>
        </ImageBackground>
        {isSelected && <View style={styles.selectedBorder} pointerEvents="none" />}
      </Pressable>
    </Animated.View>
  );
}

export type RegionSelection = {
  regions: PreferredRegion[];
  landscapes: SpotTheme[];
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
  const { t } = useTranslation();
  const [isTitleDone, setIsTitleDone] = useState(false);
  const [regions, setRegions] = useState<PreferredRegion[]>([]);
  const [landscapes, setLandscapes] = useState<SpotTheme[]>([]);

  // 지역과 풍경을 각각 하나 이상 골라야 시작할 수 있음
  const canSubmit = regions.length > 0 && landscapes.length > 0;

  return (
    <View style={styles.container}>
      <TypingTitle text={t('region.title')} onComplete={() => setIsTitleDone(true)} />

      {isTitleDone && (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Animated.View entering={stepEntering()} style={styles.section}>
              <Text typography="t6" weight="medium" color={colors.grey[600]}>
                {t('region.description')}
              </Text>
              <View style={styles.chipRow}>
                {REGIONS.map(region => (
                  <RegionChip
                    key={region}
                    label={t(`region.names.${region}`)}
                    isSelected={regions.includes(region)}
                    onPress={() => setRegions(prev => toggleSelection(prev, region))}
                  />
                ))}
              </View>
            </Animated.View>

            <Animated.View entering={stepEntering(100)} style={styles.section}>
              <Text typography="t5" weight="semiBold">
                {t('region.landscapeTitle')}
              </Text>
              <View style={styles.cardGrid}>
                {ONBOARDING_SPOT_THEMES.map(theme => (
                  <LandscapeCard
                    key={theme}
                    label={t(`spot.theme.names.${theme}`)}
                    image={SPOT_THEME_IMAGES.wide[theme]}
                    isSelected={landscapes.includes(theme)}
                    onPress={() => setLandscapes(prev => toggleSelection(prev, theme))}
                  />
                ))}
              </View>
            </Animated.View>
          </ScrollView>

          <Animated.View entering={stepEntering(200)}>
            <Button
              display="block"
              disabled={!canSubmit}
              loading={isSubmitting}
              onPress={() => onNext({ regions, landscapes })}
            >
              {t('region.start')}
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
    gap: 10,
  },
  scrollContent: {
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
    justifyContent: 'space-between',
    rowGap: 10,
  },
  cardWrapper: {
    width: '48%',
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
  labelPill: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: colors.greyOpacity[600],
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
});
