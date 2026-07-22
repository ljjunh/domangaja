import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import WebView from 'react-native-webview';
import { StaticScreenProps } from '@react-navigation/native';
import { Layout, StackHeader } from '@/shared/components/layout';

type PolicyType = 'terms' | 'privacy';

const POLICY_URLS: Record<PolicyType, string> = {
  terms: 'https://www.kakao.com/policy/terms?lang=ko',
  privacy: 'https://www.kakao.com/policy/privacy?lang=ko',
};

type PolicyScreenProps = StaticScreenProps<{ type: PolicyType }>;

export default function PolicyScreen({ route }: PolicyScreenProps) {
  const { t } = useTranslation();
  const { type } = route.params;

  return (
    <Layout>
      <StackHeader title={type === 'terms' ? t('setting.terms') : t('setting.privacy')} />
      <WebView source={{ uri: POLICY_URLS[type] }} startInLoadingState style={styles.webview} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
