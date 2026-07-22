import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { SOCIAL_PROVIDERS, type SocialProvider } from '@/domains/auth/constants/socialProviders';
import { Text } from '@/shared/components/base';

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

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        pressed && styles.pressed,
        disabled && styles.dimmed,
      ]}
    >
      <Icon style={styles.icon} />
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text typography="t6" weight="semiBold" color={textColor}>
          {t(`login.${provider}`)}
        </Text>
      )}
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
  pressed: { opacity: 0.85 },
  dimmed: { opacity: 0.4 },
  icon: { position: 'absolute', left: 20 },
});
