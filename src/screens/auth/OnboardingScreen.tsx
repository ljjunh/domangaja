import { useCallback, useEffect, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/shared/components/layout';
import { IconButton } from '@/shared/components/ui';
import { SCREEN_PADDING_BOTTOM, SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { colors } from '@/shared/constants/colors';
import { ArrowLeftIcon } from '@/assets/icons/common';
import { NicknameStep, BirthDateStep, RegionStep } from './components';
import type { RegionSelection } from './components/RegionStep';
import { Tokens, tokenStorage } from '@/shared/api/tokenStorage';
import { useAuthStore } from '@/shared/store/authStore';
import { userMutations } from '@/domains/user/api/queries';
import { showToast } from '@/shared/lib/toast';

type OnboardingScreenProps = StaticScreenProps<Tokens | undefined>;

type OnboardingStep = 'nickname' | 'birthDate' | 'region';

const STEP_ORDER: OnboardingStep[] = ['nickname', 'birthDate', 'region'];

interface OnboardingForm {
  nickname: string;
  birthDate: string | null;
}

export default function OnboardingScreen({ route }: OnboardingScreenProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const tokens = route.params;
  const login = useAuthStore(state => state.login);
  const { mutate: submitProfile, isPending } = useMutation(userMutations.updateMyProfile());

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

  // Android 하드웨어 백버튼도 뒤로가기 시 스텝 이동
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

  const handleNicknameNext = (nickname: string) => {
    setForm(prev => ({ ...prev, nickname }));
    setStep('birthDate');
  };

  const handleBirthDateNext = (birthDate: string) => {
    setForm(prev => ({ ...prev, birthDate }));
    setStep('region');
  };

  const completeOnboarding = async ({ regions, landscapes }: RegionSelection) => {
    if (tokens == null) {
      return;
    }
    await tokenStorage.save(tokens);

    // TODO: 서버 확장 시 페이로드에 포함할 수집값
    console.log('미전송 수집값(서버 확장 대기):', { ...form, regions });

    submitProfile(
      { preferredCategories: landscapes },
      {
        onSuccess: () => login(),
        onError: async () => {
          await tokenStorage.clear();
          showToast('error', t('login.errorNetwork'));
        },
      },
    );
  };

  return (
    <Layout>
      <IconButton icon={ArrowLeftIcon} onPress={goBackOneStep} color={colors.black} />
      <KeyboardAvoidingView style={styles.avoidingView} behavior="padding">
        <View style={styles.container}>
          {step === 'nickname' && <NicknameStep onNext={handleNicknameNext} />}
          {step === 'birthDate' && <BirthDateStep onNext={handleBirthDateNext} />}
          {step === 'region' && <RegionStep onNext={completeOnboarding} isSubmitting={isPending} />}
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
