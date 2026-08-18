import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { type StaticScreenProps, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Layout } from '@/shared/components/layout';
import { Image, Pressable, Text, TextInput } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { example1Image } from '@/assets/images';
import { AddIcon } from '@/assets/icons/common';
import { showToast } from '@/shared/lib/toast';
import { toastConfig } from '@/shared/lib/toastConfig';
import { checkLocationPermission } from '@/domains/feed/lib/locationPermission';
import { FormSectionLabel, PostFormHeader, PostLocationField } from './components';

// TODO: GPS 연동 시 실제 위치 값으로 교체
const MOCK_ADDRESS = '서울특별시 종로구 사직로 161';

const MAX_PHOTO_COUNT = 4;

// TODO: 실제 이미지 picker 연동 시 선택된 이미지 배열로 교체 (등록 조건: 최소 1장)
const MOCK_SELECTED_PHOTOS = [example1Image];

// 최초 위치 권한 요청/좌표 확보는 Community 리스트 화면의 + 버튼이 이미 끝내고 들어온다 —
// 이 화면은 그 결과(좌표)를 params로 받기만 한다
type FeedWriteScreenProps = StaticScreenProps<{ latitude: number; longitude: number }>;

export default function FeedWriteScreen({ route }: FeedWriteScreenProps) {
  const navigation = useNavigation();
  const { latitude, longitude } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleShare = async () => {
    // 최초 요청은 + 버튼에서 이미 끝났다 — 여기서는 그 사이 설정에서 꺼졌는지만 조용히 재확인
    const permission = await checkLocationPermission();
    if (permission !== 'granted') {
      showToast('error', '위치 접근이 꺼져 있어요. 설정에서 위치 권한을 확인해주세요.');
      return;
    }
    console.log('TODO: 피드 등록 API 연동', { latitude, longitude });
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
            <View style={styles.photoRow}>
              <Pressable
                onPress={() => console.log('TODO: 이미지 picker 연동')}
                style={styles.addPhotoTile}
              >
                <AddIcon color={colors.blue[500]} />
              </Pressable>
              {MOCK_SELECTED_PHOTOS.map((photo, index) => (
                <Image key={index} source={photo} style={styles.photoTile} resizeMode="cover" />
              ))}
            </View>
            <Text typography="st12" weight="semiBold" color={colors.grey[500]}>
              최대 {MAX_PHOTO_COUNT}장까지 추가할 수 있어요.
            </Text>
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
            <FormSectionLabel title="내용" />
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
  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
