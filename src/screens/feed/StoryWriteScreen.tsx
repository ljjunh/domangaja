import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackActions, type StaticScreenProps, useNavigation } from '@react-navigation/native';
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
import { checkLocationPermission } from '@/shared/lib/locationPermission';
import { pickStoryMedia } from '@/domains/feed/lib/mediaPicker';
import { feedMutations } from '@/domains/feed/api/queries';
import { requestPhotoPermission } from '@/domains/user/lib/photoPermission';
import { PhotoPermissionSheet } from '@/domains/user/components';
import { FormSectionLabel, PostFormHeader, PostLocationField } from './components';

// 최초 위치 권한 요청/좌표 확보는 Community 리스트 화면의 + 버튼이 이미 끝내고 들어온다 —
// 이 화면은 그 결과(좌표)를 params로 받아 등록 API에 그대로 전달한다.
// 지역명/장소명은 서버가 좌표로부터 채워주므로 클라이언트에서 따로 변환하지 않는다
type StoryWriteScreenProps = StaticScreenProps<{ latitude: number; longitude: number }>;

export default function StoryWriteScreen({ route }: StoryWriteScreenProps) {
  const { t } = useTranslation();
  const { latitude, longitude } = route.params;
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
      showToast('error', t('feed.error.selectMedia'));
      return;
    }

    setIsProcessing(true);

    // 최초 요청은 + 버튼에서 이미 끝났다 — 여기서는 그 사이 설정에서 꺼졌는지만 조용히 재확인
    const permission = await checkLocationPermission();
    if (permission !== 'granted') {
      setIsProcessing(false);
      showToast('error', t('feed.error.locationOff'));
      return;
    }

    let imageUrl: string;
    try {
      imageUrl = await uploadImage(selectedMedia);
    } catch {
      setIsProcessing(false);
      showToast('error', t('feed.error.uploadFailed'));
      return;
    }

    createStory(
      { latitude, longitude, imageUrl },
      {
        // 등록 성공 응답이 상세 데이터와 동일한 구조라 상세 조회 API를 다시 부르지 않고 그대로 넘긴다.
        // navigate가 아니라 replace — 작성 화면을 스택에서 지워야 상세에서 닫았을 때 목록으로 바로 돌아간다
        onSuccess: story => {
          setIsProcessing(false);
          navigation.dispatch(StackActions.replace('StoryDetail', { story }));
        },
        onError: () => {
          setIsProcessing(false);
          showToast('error', t('feed.error.createStory'));
        },
      },
    );
  };

  const isVideo = selectedMedia != null && selectedMedia.mime.startsWith('video');

  return (
    <Layout>
      <PostFormHeader
        title={t('feed.storyWrite.title')}
        onClose={() => navigation.goBack()}
        onShare={handleShare}
      />
      <View style={styles.container}>
        <PostLocationField address={t('feed.postForm.autoLocation')} />

        <View style={styles.section}>
          <FormSectionLabel title={t('feed.storyWrite.photoLabel')} required />
          <Pressable onPress={handlePickMedia} style={styles.mediaPicker}>
            {selectedMedia == null && (
              <>
                <GalleryIcon width={32} height={32} color={colors.grey[500]} />
                <Text typography="st10" weight="semiBold" color={colors.grey[500]}>
                  {t('feed.storyWrite.photoPlaceholder')}
                </Text>
                <Text typography="st13" weight="semiBold" color={colors.grey[400]}>
                  {t('feed.storyWrite.photoLimit')}
                </Text>
              </>
            )}
            {selectedMedia != null && isVideo && (
              <>
                <PlayFillIcon width={32} height={32} color={colors.grey[500]} />
                <Text typography="st10" weight="semiBold" color={colors.grey[500]}>
                  {t('feed.storyWrite.videoSelected')}
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
