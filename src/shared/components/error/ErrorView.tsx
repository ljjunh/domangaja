import { type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { type SvgProps } from 'react-native-svg';
import { Text } from '@/shared/components/base';
import { Layout } from '@/shared/components/layout';
import { Button } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';

interface ErrorViewProps {
  icon: ComponentType<SvgProps>;
  iconColor: string;
  iconBadgeColor: string;
  title: string;
  description: string;
  onRetry: () => void;
}

export default function ErrorView({
  icon: Icon,
  iconColor,
  iconBadgeColor,
  title,
  description,
  onRetry,
}: ErrorViewProps) {
  const { t } = useTranslation();

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.iconBadge, { backgroundColor: iconBadgeColor }]}>
            <Icon width={36} height={36} color={iconColor} />
          </View>
          <Text typography="t4" weight="semiBold" textAlign="center">
            {title}
          </Text>
          <Text typography="t5" weight="medium" color={colors.grey[600]} textAlign="center">
            {description}
          </Text>
        </View>

        <Button size="large" onPress={onRetry} containerStyle={styles.button}>
          {t('error.retry')}
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL + 30,
    gap: 20,
  },
  iconBadge: {
    padding: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 10,
  },
  button: {
    alignSelf: 'center',
  },
});
