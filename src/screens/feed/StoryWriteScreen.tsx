import { StyleSheet, View } from 'react-native';
import { type StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Layout } from '@/shared/components/layout';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { GalleryIcon } from '@/assets/icons/common';
import { showToast } from '@/shared/lib/toast';
import { checkLocationPermission } from '@/domains/feed/lib/locationPermission';
import { FormSectionLabel, PostFormHeader, PostLocationField } from './components';

// TODO: GPS 연동 시 실제 위치 값으로 교체
const MOCK_ADDRESS = '서울특별시 종로구 사직로 161';

// 최초 위치 권한 요청/좌표 확보는 Community 리스트 화면의 + 버튼이 이미 끝내고 들어온다 —
// 이 화면은 그 결과(좌표)를 params로 받기만 한다
type StoryWriteScreenProps = StaticScreenProps<{ latitude: number; longitude: number }>;

export default function StoryWriteScreen({ route }: StoryWriteScreenProps) {
  const navigation = useNavigation();
  const { latitude, longitude } = route.params;

  const handleShare = async () => {
    // 최초 요청은 + 버튼에서 이미 끝났다 — 여기서는 그 사이 설정에서 꺼졌는지만 조용히 재확인
    const permission = await checkLocationPermission();
    if (permission !== 'granted') {
      showToast('error', '위치 접근이 꺼져 있어요. 설정에서 위치 권한을 확인해주세요.');
      return;
    }
    console.log('TODO: 스토리 등록 API 연동', { latitude, longitude });
  };

  return (
    <Layout>
      <PostFormHeader
        title="스토리 올리기"
        onClose={() => navigation.goBack()}
        onShare={handleShare}
      />
      <View style={styles.container}>
        <PostLocationField address={MOCK_ADDRESS} />

        <View style={styles.section}>
          <FormSectionLabel title="사진 또는 짧은 영상" required />
          <Pressable
            onPress={() => console.log('TODO: 이미지/영상 picker 연동')}
            style={styles.mediaPicker}
          >
            <GalleryIcon width={32} height={32} color={colors.grey[500]} />
            <Text typography="st10" weight="semiBold" color={colors.grey[500]}>
              사진 또는 짧은 영상을 추가해주세요
            </Text>
            <Text typography="st13" weight="semiBold" color={colors.grey[400]}>
              (1개 선택 가능)
            </Text>
          </Pressable>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 24,
  },

  section: {
    gap: 10,
  },

  mediaPicker: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    backgroundColor: colors.grey[100],
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
