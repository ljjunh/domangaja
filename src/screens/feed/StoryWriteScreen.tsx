import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { type StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { Layout } from '@/shared/components/layout';
import { Image, Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { GalleryIcon, PlayFillIcon } from '@/assets/icons/common';
import { showToast } from '@/shared/lib/toast';
import { toastConfig } from '@/shared/lib/toastConfig';
import { uploadImage, type UploadFile } from '@/shared/api/service';
import { checkLocationPermission } from '@/domains/feed/lib/locationPermission';
import { pickStoryMedia } from '@/domains/feed/lib/mediaPicker';
import { feedMutations } from '@/domains/feed/api/queries';
import { MOCK_STORY_LOCATION } from '@/domains/feed/constants/mockStoryUpload';
import { requestPhotoPermission } from '@/domains/user/lib/photoPermission';
import { PhotoPermissionSheet } from '@/domains/user/components';
import { FormSectionLabel, PostFormHeader, PostLocationField } from './components';

// TODO: GPS 연동 시 실제 위치 값으로 교체
const MOCK_ADDRESS = '서울특별시 종로구 사직로 161';

// 최초 위치 권한 요청/좌표 확보는 Community 리스트 화면의 + 버튼이 이미 끝내고 들어온다 —
// 이 화면은 그 결과(좌표)를 params로 받기만 한다.
// 단, 등록 API의 regionName/spotName은 아직 역지오코딩이 없어 MOCK_STORY_LOCATION을 대신 사용한다 —
// 그래서 route.params의 좌표는 현재 등록 요청에 쓰지 않는다 (실제 GPS 연동 시 교체 대상)
type StoryWriteScreenProps = StaticScreenProps<{ latitude: number; longitude: number }>;

export default function StoryWriteScreen(_props: StoryWriteScreenProps) {
  const navigation = useNavigation();
  const [selectedMedia, setSelectedMedia] = useState<UploadFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // 이 화면은 fullScreenModal이라 전역 overlay(OverlayProvider)에 띄우면 네이티브 모달 레이어
  // 뒤에 가려진다(LocationPermissionSheet와 같은 문제) — 화면 자신의 트리 안에서 직접 그린다
  const [isPhotoPermissionSheetVisible, setIsPhotoPermissionSheetVisible] = useState(false);

  const { mutate: createStory } = useMutation(feedMutations.createStory());

  const handlePickMedia = async () => {
    const permission = await requestPhotoPermission();
    if (permission === 'blocked') {
      setIsPhotoPermissionSheetVisible(true);
      return;
    }
    // retriable(안드로이드 1회 거절)은 조용히 종료 — 다시 탭하면 시스템이 한 번 더 물어본다
    if (permission !== 'granted') {
      return;
    }

    const result = await pickStoryMedia();
    if (result.status === 'noPermission') {
      setIsPhotoPermissionSheetVisible(true);
      return;
    }
    if (result.status === 'picked') {
      setSelectedMedia(result.file);
    }
  };

  const handleShare = async () => {
    if (isProcessing) {
      return;
    }
    if (selectedMedia == null) {
      showToast('error', '사진 또는 영상을 선택해주세요.');
      return;
    }

    setIsProcessing(true);

    // 최초 요청은 + 버튼에서 이미 끝났다 — 여기서는 그 사이 설정에서 꺼졌는지만 조용히 재확인
    const permission = await checkLocationPermission();
    if (permission !== 'granted') {
      setIsProcessing(false);
      showToast('error', '위치 접근이 꺼져 있어요. 설정에서 위치 권한을 확인해주세요.');
      return;
    }

    let imageUrl: string;
    try {
      imageUrl = await uploadImage(selectedMedia);
    } catch {
      setIsProcessing(false);
      showToast('error', '파일 업로드에 실패했어요. 잠시 후 다시 시도해주세요.');
      return;
    }

    createStory(
      { ...MOCK_STORY_LOCATION, imageUrl },
      {
        // 등록 성공 응답이 상세 데이터와 동일한 구조라 상세 조회 API를 다시 부르지 않고 그대로 넘긴다
        onSuccess: story => {
          setIsProcessing(false);
          navigation.navigate('StoryDetail', { story });
        },
        onError: () => {
          setIsProcessing(false);
          showToast('error', '스토리 등록에 실패했어요. 잠시 후 다시 시도해주세요.');
        },
      },
    );
  };

  const isVideo = selectedMedia != null && selectedMedia.mime.startsWith('video');

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
          <Pressable onPress={handlePickMedia} style={styles.mediaPicker}>
            {selectedMedia == null && (
              <>
                <GalleryIcon width={32} height={32} color={colors.grey[500]} />
                <Text typography="st10" weight="semiBold" color={colors.grey[500]}>
                  사진 또는 짧은 영상을 추가해주세요
                </Text>
                <Text typography="st13" weight="semiBold" color={colors.grey[400]}>
                  (1개 선택 가능)
                </Text>
              </>
            )}
            {selectedMedia != null && isVideo && (
              <>
                <PlayFillIcon width={32} height={32} color={colors.grey[500]} />
                <Text typography="st10" weight="semiBold" color={colors.grey[500]}>
                  동영상이 선택되었어요
                </Text>
              </>
            )}
            {selectedMedia != null && !isVideo && (
              <Image
                source={{ uri: selectedMedia.uri }}
                style={styles.mediaPreview}
                resizeMode="contain"
              />
            )}
          </Pressable>
        </View>
      </View>

      {isPhotoPermissionSheetVisible && (
        <PhotoPermissionSheet onClose={() => setIsPhotoPermissionSheetVisible(false)} />
      )}

      <Toast config={toastConfig} position="bottom" bottomOffset={80} />
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
    overflow: 'hidden',
  },

  mediaPreview: {
    width: '100%',
    height: '100%',
  },
});
