import { useCallback, useEffect, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { IS_IOS } from '@/shared/constants/platform';
import { useNavigation } from '@react-navigation/native';
import { Layout } from '@/shared/components/layout';
import { IconButton } from '@/shared/components/ui';
import { SCREEN_PADDING_BOTTOM, SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { colors } from '@/shared/constants/colors';
import { ArrowLeftIcon } from '@/assets/icons/common';
import { NicknameStep, BirthDateStep, RegionStep } from './components';

type OnboardingStep = 'nickname' | 'birthDate' | 'region';

const STEP_ORDER: OnboardingStep[] = ['nickname', 'birthDate', 'region'];

interface OnboardingForm {
  nickname: string;
  birthDate: string | null;
}

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState<OnboardingStep>('nickname');
  const [form, setForm] = useState<OnboardingForm>({
    nickname: '',
    birthDate: null,
  });

  // 첫 단계면 화면을 나가고, 아니면 이전 단계로
  const goBackOneStep = useCallback(() => {
    const index = STEP_ORDER.indexOf(step);
    if (index === 0) {
      navigation.goBack();
      return;
    }
    setStep(STEP_ORDER[index - 1]);
  }, [step, navigation]);

  // Android 하드웨어 백버튼도 같은 규칙
  useEffect(
    function stepBackOnAndroidBackPress() {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        goBackOneStep();
        return true;
      });
      return () => subscription.remove();
    },
    [goBackOneStep],
  );

  return (
    <Layout>
      <IconButton icon={ArrowLeftIcon} onPress={goBackOneStep} color={colors.black} />
      {/* iOS는 키보드가 화면을 밀지 않으므로 키보드 높이만큼 패딩을 넣어 하단 버튼을 띄운다 */}
      <KeyboardAvoidingView style={styles.avoidingView} behavior={IS_IOS ? 'padding' : undefined}>
        <View style={styles.container}>
          {step === 'nickname' && (
            <NicknameStep
              onNext={nickname => {
                setForm(prev => ({ ...prev, nickname }));
                setStep('birthDate');
              }}
            />
          )}
          {step === 'birthDate' && (
            <BirthDateStep
              onNext={birthDate => {
                setForm(prev => ({ ...prev, birthDate }));
                setStep('region');
              }}
            />
          )}
          {step === 'region' && (
            <RegionStep
              onNext={({ regions, landscapes }) => {
                const completed = { ...form, regions, landscapes };
                // TODO: 회원가입 제출 API 연동
                console.log('온보딩 완료:', completed);
              }}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  avoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 24,
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingBottom: SCREEN_PADDING_BOTTOM,
  },
});
