import { useEffect } from 'react';
import { BackHandler, Linking, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { Layout } from '@/shared/components/layout';
import { Button } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { IS_IOS } from '@/shared/constants/platform';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { STORE_SCHEME_URL, STORE_WEB_URL } from '@/shared/constants/store';
import { FileUploadOutlineIcon } from '@/assets/icons/common';

const ICON_SIZE = 36;
const STORE_KEY = IS_IOS ? 'ios' : 'android';

export default function ForceUpdateScreen() {
  const { t } = useTranslation();

  // 안드로이드 하드웨어 뒤로가기까지 막기
  useEffect(function blockHardwareBack() {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, []);

  const openStore = () => {
    // 시뮬레이터엔 스토어 앱이 없어 스킴이 실패
    Linking.openURL(STORE_SCHEME_URL).catch(() => Linking.openURL(STORE_WEB_URL));
  };

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconBadge}>
            <FileUploadOutlineIcon width={ICON_SIZE} height={ICON_SIZE} color={colors.blue[500]} />
          </View>
          <Text typography="t3" weight="bold" textAlign="center">
            {t('forceUpdate.title')}
          </Text>
          <Text typography="t5" weight="medium" color={colors.grey[600]} textAlign="center">
            {t('forceUpdate.description')}
          </Text>
        </View>

        <Button size="large" display="block" onPress={openStore}>
          {t(`forceUpdate.${STORE_KEY}.action`)}
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL + 30,
    gap: 20,
  },
  content: {
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.blue[50],
  },
});
