import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
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
import { MOCK_FEED_LOCATION } from '@/domains/feed/constants/mockFeedUpload';
import { requestPhotoPermission } from '@/domains/user/lib/photoPermission';
import { PhotoPermissionSheet } from '@/domains/user/components';
import { FormSectionLabel, PostFormHeader, PostLocationField } from './components';

// TODO: GPS 연동 시 실제 위치 값으로 교체
const MOCK_ADDRESS = '서울특별시 종로구 사직로 161';

// 최초 위치 권한 요청/좌표 확보는 Community 리스트 화면의 + 버튼이 이미 끝내고 들어온다 —
// 이 화면은 그 결과(좌표)를 params로 받기만 한다.
// 단, 등록 API의 regionName/spotName은 아직 역지오코딩이 없어 MOCK_FEED_LOCATION을 대신 사용한다 —
// 그래서 route.params의 좌표는 현재 등록 요청에 쓰지 않는다 (실제 GPS 연동 시 교체 대상)
type FeedWriteScreenProps = StaticScreenProps<{ latitude: number; longitude: number }>;

export default function FeedWriteScreen(_props: FeedWriteScreenProps) {
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
      showToast('error', '사진을 선택해주세요.');
      return;
    }
    const trimmedTitle = title.trim();
    if (trimmedTitle === '') {
      showToast('error', '제목을 입력해주세요.');
      return;
    }
    const trimmedContent = content.trim();
    if (trimmedContent === '') {
      showToast('error', '내용을 입력해주세요.');
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
      imageUrl = await uploadImage(selectedPhoto);
    } catch {
      setIsProcessing(false);
      showToast('error', '파일 업로드에 실패했어요. 잠시 후 다시 시도해주세요.');
      return;
    }

    createFeed(
      {
        ...MOCK_FEED_LOCATION,
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
          showToast('error', '피드 등록에 실패했어요. 잠시 후 다시 시도해주세요.');
        },
      },
    );
  };

  return (
    <Layout>
      <PostFormHeader
        title="피드 올리기"
        onClose={() => navigation.goBack()}
        onShare={handleShare}
      />
      <KeyboardAvoidingView style={styles.avoidingView} behavior="padding">
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <PostLocationField address={MOCK_ADDRESS} />

          <View style={styles.section}>
            <FormSectionLabel title="사진" required />
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
            <FormSectionLabel title="제목" required />
            <TextInput
              typography="st10"
              value={title}
              onChangeText={setTitle}
              placeholder="제목을 입력해주세요 (최대 30자)"
              style={styles.titleInput}
            />
          </View>

          <View style={styles.section}>
            <FormSectionLabel title="내용" required />
            <TextInput
              typography="st10"
              value={content}
              onChangeText={setContent}
              placeholder="내용을 입력해주세요 (최대 200자)"
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
