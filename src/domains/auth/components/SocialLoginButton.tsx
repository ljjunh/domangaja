import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, StyleSheet, Pressable } from 'react-native';
import { SOCIAL_PROVIDERS, type SocialProvider } from '@/domains/auth/constants/socialProviders';
import { Text } from '@/shared/components/base';
import { SPRING } from '@/shared/constants/springs';

interface SocialLoginButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  /**
   * 이 프로바이더의 로그인이 진행 중 — 스피너 표시
   * @default false
   */
  loading?: boolean;
  /**
   * 다른 프로바이더 진행 중
   * @default false
   */
  disabled?: boolean;
}

export default function SocialLoginButton({
  provider,
  onPress,
  loading = false,
  disabled = false,
}: SocialLoginButtonProps) {
  const { t } = useTranslation();
  const { Icon, backgroundColor, textColor } = SOCIAL_PROVIDERS[provider];
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={() => {
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, ...SPRING.rapid }).start();
      }}
      onPressOut={() => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...SPRING.quick }).start();
      }}
    >
      <Animated.View style={[styles.button, { backgroundColor, transform: [{ scale }] }]}>
        <Icon style={styles.icon} />
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text typography="t6" weight="semiBold" color={textColor}>
            {t(`login.${provider}`)}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    paddingVertical: 15,
    minHeight: 52,
  },
  icon: { position: 'absolute', left: 20 },
});
