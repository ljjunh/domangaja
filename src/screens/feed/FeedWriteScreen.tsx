import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackActions, type StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { Layout } from '@/shared/components/layout';
import { Image, Pressable, TextInput } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { AddIcon } from '@/assets/icons/common';
import { showToast } from '@/shared/lib/toast';
import { toastConfig } from '@/shared/lib/toastConfig';
import { uploadImage, type UploadFile } from '@/shared/api/service';
import { checkLocationPermission } from '@/shared/lib/locationPermission';
import { pickFeedPhoto } from '@/domains/feed/lib/mediaPicker';
import { feedMutations } from '@/domains/feed/api/queries';
import { requestPhotoPermission } from '@/domains/user/lib/photoPermission';
import { PhotoPermissionSheet } from '@/domains/user/components';
import { FormSectionLabel, PostFormHeader, PostLocationField } from './components';

// 최초 위치 권한 요청/좌표 확보는 Community 리스트 화면의 + 버튼이 이미 끝내고 들어온다 —
// 이 화면은 그 결과(좌표)를 params로 받아 등록 API에 그대로 전달한다.
// 지역명/장소명은 서버가 좌표로부터 채워주므로 클라이언트에서 따로 변환하지 않는다
type FeedWriteScreenProps = StaticScreenProps<{ latitude: number; longitude: number }>;

const TITLE_MAX_LENGTH = 30;
const CONTENT_MAX_LENGTH = 200;

export default function FeedWriteScreen({ route }: FeedWriteScreenProps) {
  const { t } = useTranslation();
  const { latitude, longitude } = route.params;
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<UploadFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // 이 화면은 fullScreenModal이라 전역 overlay(OverlayProvider)에 띄우면 네이티브 모달 레이어
  // 뒤에 가려진다(StoryWriteScreen과 같은 문제) — 화면 자신의 트리 안에서 직접 그린다
  const [isPhotoPermissionSheetVisible, setIsPhotoPermissionSheetVisible] = useState(false);

  const { mutate: createFeed } = useMutation(feedMutations.createFeed());

  const handlePickPhoto = async () => {
    const permission = await requestPhotoPermission();
    if (permission === 'blocked') {
      setIsPhotoPermissionSheetVisible(true);
      return;
    }
    // retriable(안드로이드 1회 거절)은 조용히 종료 — 다시 탭하면 시스템이 한 번 더 물어본다
    if (permission !== 'granted') {
      return;
    }

    const result = await pickFeedPhoto();
    if (result.status === 'noPermission') {
      setIsPhotoPermissionSheetVisible(true);
      return;
    }
    if (result.status === 'picked') {
      setSelectedPhoto(result.file);
    }
  };

  const handleShare = async () => {
    // 업로드~등록이 진행 중일 때 연타로 인한 중복 요청을 막는다
    if (isProcessing) {
      return;
    }
    if (selectedPhoto == null) {
      showToast('error', t('feed.error.selectPhoto'));
      return;
    }
    const trimmedTitle = title.trim();
    if (trimmedTitle === '') {
      showToast('error', t('feed.error.titleRequired'));
      return;
    }
    const trimmedContent = content.trim();
    if (trimmedContent === '') {
      showToast('error', t('feed.error.contentRequired'));
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
      imageUrl = await uploadImage(selectedPhoto);
    } catch {
      setIsProcessing(false);
      showToast('error', t('feed.error.uploadFailed'));
      return;
    }

    createFeed(
      {
        latitude,
        longitude,
        title: trimmedTitle,
        content: trimmedContent,
        imageUrl,
      },
      {
        // 등록 성공 응답이 상세 데이터와 동일한 구조라 상세 조회 API를 다시 부르지 않고 그대로 넘긴다.
        // navigate가 아니라 replace — 작성 화면을 스택에서 지워야 상세에서 닫았을 때 목록으로 바로 돌아간다
        onSuccess: feed => {
          setIsProcessing(false);
          navigation.dispatch(StackActions.replace('FeedDetail', { feed }));
        },
        onError: () => {
          setIsProcessing(false);
          showToast('error', t('feed.error.createFeed'));
        },
      },
    );
  };

  return (
    <Layout>
      <PostFormHeader
        title={t('feed.feedWrite.title')}
        onClose={() => navigation.goBack()}
        onShare={handleShare}
      />
      <KeyboardAvoidingView style={styles.avoidingView} behavior="padding">
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <PostLocationField address={t('feed.postForm.autoLocation')} />

          <View style={styles.section}>
            <FormSectionLabel title={t('feed.feedWrite.photoLabel')} required />
            <Pressable onPress={handlePickPhoto} style={styles.addPhotoTile}>
              {selectedPhoto == null ? (
                <AddIcon color={colors.blue[500]} />
              ) : (
                <Image
                  source={{ uri: selectedPhoto.uri }}
                  style={styles.photoTile}
                  resizeMode="cover"
                />
              )}
            </Pressable>
          </View>

          <View style={styles.section}>
            <FormSectionLabel title={t('feed.feedWrite.titleLabel')} required />
            <TextInput
              typography="st10"
              value={title}
              onChangeText={setTitle}
              placeholder={t('feed.feedWrite.titlePlaceholder')}
              maxLength={TITLE_MAX_LENGTH}
              style={styles.titleInput}
            />
          </View>

          <View style={styles.section}>
            <FormSectionLabel title={t('feed.feedWrite.contentLabel')} required />
            <TextInput
              typography="st10"
              value={content}
              onChangeText={setContent}
              placeholder={t('feed.feedWrite.contentPlaceholder')}
              maxLength={CONTENT_MAX_LENGTH}
              multiline
              textAlignVertical="top"
              style={styles.contentInput}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {isPhotoPermissionSheetVisible && (
        <PhotoPermissionSheet onClose={() => setIsPhotoPermissionSheetVisible(false)} />
      )}

      <Toast config={toastConfig} position="bottom" bottomOffset={80} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  avoidingView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  addPhotoTile: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.grey[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoTile: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  titleInput: {
    backgroundColor: colors.grey[100],
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  contentInput: {
    backgroundColor: colors.grey[100],
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 180,
  },
});
