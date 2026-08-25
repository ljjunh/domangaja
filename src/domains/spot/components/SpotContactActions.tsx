import { Linking, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { MonitorIcon } from '@/assets/icons/common';

interface SpotContactActionsProps {
  homepageUrl: string | null;
  tel: string | null;
}

export default function SpotContactActions({ homepageUrl, tel }: SpotContactActionsProps) {
  const { t } = useTranslation();

  if (!homepageUrl && !tel) return null;

  return (
    <View style={styles.container}>
      {homepageUrl && (
        <Pressable style={styles.button} onPress={() => Linking.openURL(homepageUrl)}>
          <MonitorIcon color={colors.blue[600]} />
          <Text typography="st12" weight="semiBold" color={colors.blue[600]}>
            {t('spot.contact.homepage')}
          </Text>
        </Pressable>
      )}
      {tel && (
        <Pressable
          style={styles.button}
          onPress={() => Linking.openURL(`tel:${tel.replace(/[^\d+]/g, '')}`)}
        >
          <Text typography="st12" weight="semiBold" color={colors.blue[600]}>
            {t('spot.contact.tel')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 10 },
  button: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 24,
    backgroundColor: colors.grey[100],
  },
});
