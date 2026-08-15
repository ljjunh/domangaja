import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Layout } from '@/shared/components/layout';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { GalleryIcon } from '@/assets/icons/common';
import { overlay } from '@/shared/overlay';
import { requestLocationPermission } from '@/domains/feed/lib/locationPermission';
import { LocationPermissionSheet } from '@/domains/feed/components';
import { FormSectionLabel, PostFormHeader, PostLocationField } from './components';

// TODO: GPS 연동 시 실제 위치 값으로 교체
const MOCK_ADDRESS = '서울특별시 종로구 사직로 161';

export default function StoryWriteScreen() {
  const navigation = useNavigation();

  // 시트는 스스로 퇴장 애니메이션을 돌린 뒤 onClose를 부르므로 unmount만 연결
  const openPermissionSheet = () => {
    overlay.open(({ unmount }) => <LocationPermissionSheet onClose={unmount} />);
  };

  const handleShare = async () => {
    const permission = await requestLocationPermission();
    if (permission === 'blocked') {
      openPermissionSheet();
      return;
    }
    // retriable(안드로이드 1회 거절)은 조용히 종료 — 다시 탭하면 시스템이 한 번 더 물어본다
    if (permission !== 'granted') {
      return;
    }
    console.log('TODO: 스토리 등록 API 연동');
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
