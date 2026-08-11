import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Layout, StackHeader } from '@/shared/components/layout';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { userQueries } from '@/domains/user/api/queries';
import { MyInfoForm, MyInfoSkeleton } from './components';

// TODO: 갤러리 권한 거부 시 시스템권한으로 이동하는 바텀시트
// TODO: 저장 뮤테이션 연결 (닉네임 수정 + 이미지 업로드)

export default function MyInfoScreen() {
  const { t } = useTranslation();
  const { data: me } = useQuery(userQueries.getMe());

  return (
    <Layout>
      <StackHeader title={t('myInfo.title')} />
      <View style={styles.container}>
        {me == null ? <MyInfoSkeleton /> : <MyInfoForm me={me} />}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL + 15,
    paddingTop: 50,
    gap: 15,
  },
});
