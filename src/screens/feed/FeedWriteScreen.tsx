import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Layout } from '@/shared/components/layout';
import { Image, Pressable, Text, TextInput } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { example1Image } from '@/assets/images';
import { AddIcon } from '@/assets/icons/common';
import { overlay } from '@/shared/overlay';
import { requestLocationPermission } from '@/domains/feed/lib/locationPermission';
import { LocationPermissionSheet } from '@/domains/feed/components';
import { FormSectionLabel, PostFormHeader, PostLocationField } from './components';

// TODO: GPS 연동 시 실제 위치 값으로 교체
const MOCK_ADDRESS = '서울특별시 종로구 사직로 161';

const MAX_PHOTO_COUNT = 4;

// TODO: 실제 이미지 picker 연동 시 선택된 이미지 배열로 교체 (등록 조건: 최소 1장)
const MOCK_SELECTED_PHOTOS = [example1Image];

export default function FeedWriteScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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
    console.log('TODO: 피드 등록 API 연동');
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
