import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Text, TextInput } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { validateBirthDate } from '@/domains/user/utils/validateBirthDate';
import TypingTitle from './TypingTitle';
// import EmojiSticker from './EmojiSticker';
import StepNextButton from './StepNextButton';
import { stepEntering } from '../utils/stepEntering';

const BIRTH_DATE_MASK = 'YYYY/MM/DD';
const BIRTH_DATE_DIGIT_COUNT = 8;

function formatBirthDate(digits: string): string {
  const year = digits.slice(0, 4);
  const month = digits.slice(4, 6);
  const day = digits.slice(6, 8);

  let formatted = year;
  if (month) {
    formatted += `/${month}`;
  }
  if (day) {
    formatted += `/${day}`;
  }
  return formatted;
}

function toServerBirthDate(digits: string): string {
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

interface BirthDateStepProps {
  onNext: (birthDate: string) => void;
}

export default function BirthDateStep({ onNext }: BirthDateStepProps) {
  const { t } = useTranslation();
  const [isTitleDone, setIsTitleDone] = useState(false);
  const [birthDigits, setBirthDigits] = useState('');

  const formatted = formatBirthDate(birthDigits);
  const validation = validateBirthDate(birthDigits);
  // 입력 중에는 조용히 — 8자리를 다 채운 뒤에만 사유를 말한다
  const errorReason =
    birthDigits.length === BIRTH_DATE_DIGIT_COUNT && !validation.ok ? validation.reason : null;

  return (
    <View style={styles.container}>
      <TypingTitle text={t('birthDate.title')} onComplete={() => setIsTitleDone(true)} />

      {isTitleDone && (
        <>
          <View style={styles.inputArea}>
            <Animated.View entering={stepEntering()}>
              <TextInput
                typography="t6"
                weight="semiBold"
                value={formatted}
                onChangeText={text => setBirthDigits(text.replace(/\D/g, '').slice(0, 8))}
                keyboardType="number-pad"
                autoFocus
                style={styles.input}
              />
              <View style={styles.maskOverlay} pointerEvents="none">
                <Text typography="t6" weight="semiBold" style={styles.maskTyped}>
                  {formatted}
                </Text>
                <Text typography="t6" weight="semiBold" color={colors.grey[500]}>
                  {BIRTH_DATE_MASK.slice(formatted.length)}
                </Text>
              </View>
              {/* <View style={styles.sticker}>
                <EmojiSticker emoji="🎂" />
              </View> */}
            </Animated.View>

            {errorReason != null && (
              <Text
                typography="t7"
                weight="semiBold"
                color={colors.red[500]}
                style={styles.errorMessage}
              >
                {t(`birthDate.${errorReason}`)}
              </Text>
            )}
          </View>
          <Animated.View entering={stepEntering(200)} style={styles.nextButtonArea}>
            <StepNextButton
              disabled={!validation.ok}
              onPress={() => onNext(toServerBirthDate(birthDigits))}
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
  // 입력창과 에러 문구를 한 덩어리로 묶는다 (마스크 오버레이는 입력창 기준으로 남겨둠)
  inputArea: {
    gap: 4,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: colors.grey[100],
    fontVariant: ['tabular-nums'], // 숫자 폭 고정 — 타이핑 시 잔여 형식 흔들림 완화
  },
  // 입력창 안쪽 텍스트와 왼쪽을 맞춘다
  errorMessage: {
    paddingHorizontal: 16,
  },
  maskOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  maskTyped: {
    opacity: 0,
    fontVariant: ['tabular-nums'],
  },
  nextButtonArea: {
    marginTop: 'auto',
  },
});
