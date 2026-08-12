import { Keyboard, StyleSheet } from 'react-native';
import { Image, Pressable } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { overlay } from '@/shared/overlay';
import type { UploadFile } from '@/shared/api/service';
import { pickSquareImage } from '../lib/imagePicker';
import { requestPhotoPermission } from '../lib/photoPermission';
import PhotoPermissionSheet from './PhotoPermissionSheet';

interface ProfileImagePickerProps {
  imageUri: string | null;
  onChange: (image: UploadFile) => void;
}

const IMAGE_SIZE = 100;

export default function ProfileImagePicker({ imageUri, onChange }: ProfileImagePickerProps) {
  // 시트는 스스로 퇴장 애니메이션을 돌린 뒤 onClose를 부르므로 unmount만 연결
  const openPermissionSheet = () => {
    overlay.open(({ unmount }) => <PhotoPermissionSheet onClose={unmount} />);
  };

  const handlePress = async () => {
    Keyboard.dismiss();

    const permission = await requestPhotoPermission();
    if (permission === 'blocked') {
      openPermissionSheet();
      return;
    }
    // retriable(안드로이드 1회 거절)은 조용히 종료 — 다시 탭하면 시스템이 한 번 더 물어본다
    if (permission !== 'granted') {
      return;
    }

    const result = await pickSquareImage();
    if (result.status === 'noPermission') {
      openPermissionSheet();
      return;
    }
    if (result.status === 'picked') {
      onChange(result.image);
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.circle}>
      {!!imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    backgroundColor: colors.grey[200],
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    flex: 1,
  },
});
