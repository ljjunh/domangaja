import { ScrollView, StyleSheet } from 'react-native';
import { Text } from '@/shared/components/base';
import { Layout } from '@/shared/components/layout';
import { MAIN_TAB_SCREEN_EDGES, SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { Header } from '@/shared/components/layout';
import { NotificationButton } from '@/domains/notification/components';
import { useMainTabBarSpace } from '@/shared/hooks/useMainTabBarSpace';

export default function HomeScreen() {
  const mainTabBarSpace = useMainTabBarSpace();

  return (
    <Layout edges={MAIN_TAB_SCREEN_EDGES}>
      <Header
        left={
          <Text typography="t4" weight="bold">
            도망가자
          </Text>
        }
        right={<NotificationButton />}
      />
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: mainTabBarSpace }]}>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
        <Text typography="t1">홈화면</Text>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
  },
});
