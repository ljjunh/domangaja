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
import { TextInput } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import TypingTitle from './TypingTitle';
import StepNextButton from './StepNextButton';
import { stepEntering } from '../utils/stepEntering';

// 입력이 이 시간 동안 멈추면 중복 확인 시작
const DEBOUNCE_MS = 500;
// TODO: 서버 중복 확인 API로 대체 — 지금은 타이머
const MOCK_RESPONSE_MS = 1000;
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
          d={buildRoundedRectPath(layout.width, layout.height, INPUT_RADIUS, CHECK_STROKE_WIDTH / 2)}
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

// idle: 입력 중/대기, checking: 중복 확인 중(스피너), confirmed: 사용 가능(테두리 + 버튼 활성)
type CheckStatus = 'idle' | 'checking' | 'confirmed';

interface NicknameStepProps {
  onNext: (nickname: string) => void;
}

export default function NicknameStep({ onNext }: NicknameStepProps) {
  const [isTitleDone, setIsTitleDone] = useState(false);
  const [nickname, setNickname] = useState('');
  const [status, setStatus] = useState<CheckStatus>('idle');
  const [inputLayout, setInputLayout] = useState<LayoutRectangle | null>(null);

  // 테두리 채움 진행률 (0 → 1)
  const checkProgress = useSharedValue(0);

  const handleChangeText = (text: string) => {
    setNickname(text);
    // 다시 입력하면 확인 무효 — 테두리도 즉시 리셋
    setStatus('idle');
    checkProgress.value = 0;
  };

  useEffect(
    function startCheckAfterTypingPause() {
      if (status !== 'idle' || nickname.trim().length === 0) {
        return;
      }
      const id = setTimeout(() => setStatus('checking'), DEBOUNCE_MS);
      return () => clearTimeout(id);
    },
    [nickname, status],
  );

  useEffect(
    function mockDuplicateCheck() {
      if (status !== 'checking') {
        return;
      }
      // TODO: 서버 중복 확인 API로 대체 — 응답 성공 시나리오만 흉내
      const id = setTimeout(() => {
        setStatus('confirmed');
        checkProgress.value = withTiming(1, {
          duration: BORDER_FILL_MS,
          easing: Easing.out(Easing.quad),
        });
      }, MOCK_RESPONSE_MS);
      return () => clearTimeout(id);
    },
    [status, checkProgress],
  );

  return (
    <View style={styles.container}>
      {/* TODO: 다국어 처리 예정 */}
      <TypingTitle text={'뭐라고\n불러드릴까요?'} onComplete={() => setIsTitleDone(true)} />

      {isTitleDone && (
        <>
          <Animated.View entering={stepEntering()}>
            <TextInput
              typography="t6"
              weight="semiBold"
              value={nickname}
              onChangeText={handleChangeText}
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
            {inputLayout != null && status === 'confirmed' && (
              <CheckCompleteBorder layout={inputLayout} progress={checkProgress} />
            )}
            {/* <View style={styles.sticker}>
              <EmojiSticker emoji="👋" />
            </View> */}
          </Animated.View>
          <Animated.View entering={stepEntering(200)} style={styles.nextButtonArea}>
            <StepNextButton disabled={status !== 'confirmed'} onPress={() => onNext(nickname)} />
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
  input: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: INPUT_RADIUS,
    backgroundColor: colors.grey[100],
  },
  // 입력창 오른쪽 안에 세로 중앙 정렬
  checkingSpinner: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  // 입력창과 같은 자리에 겹치는 테두리 레이어
  checkBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  nextButtonArea: {
    marginTop: 'auto',
  },
});
