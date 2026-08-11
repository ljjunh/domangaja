import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, type LayoutRectangle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { Text, TextInput } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { normalizeNickname } from '@/domains/user/utils/validateNickname';
import { useNicknameAvailability } from '@/domains/user/hooks/useNicknameAvailability';
import TypingTitle from './TypingTitle';
import StepNextButton from './StepNextButton';
import { stepEntering } from '../utils/stepEntering';

// 확인 완료 시 테두리가 채워지는 시간
const BORDER_FILL_MS = 600;
const INPUT_RADIUS = 12;
const CHECK_STROKE_WIDTH = 2;

const AnimatedPath = Animated.createAnimatedComponent(Path);

// 좌하단에서 시작해 왼쪽 변을 타고 올라가는 시계방향 라운드 사각형 경로
// (Rect는 선의 시작점을 못 골라서 직접 그림 — 시작점을 바꾸려면 세그먼트 순서를 재배열)
function buildRoundedRectPath(width: number, height: number, radius: number, inset: number) {
  const left = inset;
  const top = inset;
  const right = width - inset;
  const bottom = height - inset;
  return [
    `M ${left} ${bottom - radius}`, // 시작: 왼쪽 변의 아래끝
    `V ${top + radius}`, // 좌측 ↑
    `A ${radius} ${radius} 0 0 1 ${left + radius} ${top}`,
    `H ${right - radius}`, // 상단 →
    `A ${radius} ${radius} 0 0 1 ${right} ${top + radius}`,
    `V ${bottom - radius}`, // 우측 ↓
    `A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom}`,
    `H ${left + radius}`, // 하단 ←
    `A ${radius} ${radius} 0 0 1 ${left} ${bottom - radius}`, // 좌하단 모서리 → 시작점 복귀
  ].join(' ');
}

// 확인 완료 시 입력창 둘레를 따라 그려지는 테두리 — SVG dash 트릭을 여기 격리
function CheckCompleteBorder({
  layout,
  progress,
}: {
  layout: LayoutRectangle;
  progress: SharedValue<number>;
}) {
  // 둘레: 직선 구간 + 모서리 원호
  const perimeter =
    2 * (layout.width + layout.height) - 8 * INPUT_RADIUS + 2 * Math.PI * INPUT_RADIUS;

  // 진행률만큼 선이 그려지도록 dashoffset을 줄인다
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: perimeter * (1 - progress.value),
  }));

  return (
    <View style={styles.checkBorder} pointerEvents="none">
      <Svg width={layout.width} height={layout.height}>
        <AnimatedPath
          d={buildRoundedRectPath(
            layout.width,
            layout.height,
            INPUT_RADIUS,
            CHECK_STROKE_WIDTH / 2,
          )}
          fill="none"
          stroke={colors.blue[500]}
          strokeWidth={CHECK_STROKE_WIDTH}
          strokeDasharray={perimeter}
          // 애니메이션 props가 붙기 전 첫 프레임에 선이 다 보이는 것 방지
          strokeDashoffset={perimeter}
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
}

interface NicknameStepProps {
  onNext: (nickname: string) => void;
  // 온보딩 시점엔 tokenStorage가 비어있어서 중복 확인 요청에 직접 실어 보낸다
  accessToken: string | undefined;
}

export default function NicknameStep({ onNext, accessToken }: NicknameStepProps) {
  const { t } = useTranslation();
  const [isTitleDone, setIsTitleDone] = useState(false);
  const [nickname, setNickname] = useState('');
  const [inputLayout, setInputLayout] = useState<LayoutRectangle | null>(null);

  const { status, reason } = useNicknameAvailability(nickname, accessToken);

  // 테두리 채움 진행률 (0 → 1)
  const checkProgress = useSharedValue(0);

  useEffect(
    function fillBorderWhenAvailable() {
      checkProgress.value =
        status === 'available'
          ? withTiming(1, { duration: BORDER_FILL_MS, easing: Easing.out(Easing.quad) })
          : 0;
    },
    [status, checkProgress],
  );

  // LENGTH/FORMAT은 클라이언트 검증을 통과했는데 서버가 거절한 경우 = 규칙 불일치.
  // 유저에게 설명할 수 있는 사유는 중복뿐이다
  const errorMessageKey = reason === 'DUPLICATE' ? 'nickname.duplicate' : 'nickname.unavailable';

  return (
    <View style={styles.container}>
      {/* TODO: 다국어 처리 예정 */}
      <TypingTitle text={'뭐라고\n불러드릴까요?'} onComplete={() => setIsTitleDone(true)} />

      {isTitleDone && (
        <>
          <View style={styles.inputArea}>
            <Animated.View entering={stepEntering()}>
              <TextInput
                typography="t6"
                weight="semiBold"
                value={nickname}
                onChangeText={setNickname}
                placeholder="닉네임"
                autoFocus
                onLayout={event => setInputLayout(event.nativeEvent.layout)}
                style={styles.input}
              />
              {/* 중복 확인 중 표시 */}
              {status === 'checking' && (
                <View style={styles.checkingSpinner}>
                  <ActivityIndicator size="small" color={colors.grey[500]} />
                </View>
              )}
              {inputLayout != null && status === 'available' && (
                <CheckCompleteBorder layout={inputLayout} progress={checkProgress} />
              )}
              {/* <View style={styles.sticker}>
                <EmojiSticker emoji="👋" />
              </View> */}
            </Animated.View>

            {/* 규칙 안내 — 확인이 시작되면 스피너·테두리가 상태를 말하므로 숨긴다 */}
            {status === 'idle' && (
              <Text typography="t7" weight="semiBold" color={colors.grey[500]} style={styles.rule}>
                {t('nickname.rule')}
              </Text>
            )}
            {status === 'unavailable' && (
              <Text typography="t7" weight="semiBold" color={colors.red[500]} style={styles.rule}>
                {t(errorMessageKey)}
              </Text>
            )}
            {status === 'failed' && (
              <Text typography="t7" weight="semiBold" color={colors.red[500]} style={styles.rule}>
                {t('nickname.checkFailed')}
              </Text>
            )}
          </View>
          <Animated.View entering={stepEntering(200)} style={styles.nextButtonArea}>
            <StepNextButton
              disabled={status !== 'available'}
              onPress={() => onNext(normalizeNickname(nickname))}
            />
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
  },
  // sticker: {
  //   position: 'absolute',
  //   top: -35,
  //   right: -10,
  // },
  inputArea: {
    gap: 4,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: INPUT_RADIUS,
    backgroundColor: colors.grey[100],
  },
  rule: {
    paddingHorizontal: 16,
  },
  checkingSpinner: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  checkBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  nextButtonArea: {
    marginTop: 'auto',
  },
});
