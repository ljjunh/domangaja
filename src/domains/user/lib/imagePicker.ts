import ImagePicker from 'react-native-image-crop-picker';
import type { UploadFile } from '@/shared/api/service';

const PROFILE_IMAGE_SIZE = 400;
const COMPRESS_QUALITY = 0.8;
const UPLOAD_MIME = 'image/jpeg';
const UPLOAD_FILE_NAME = 'profile.jpg';

function isPickerCancelled(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'E_PICKER_CANCELLED'
  );
}

export async function pickSquareImage(): Promise<UploadFile | null> {
  try {
    const image = await ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      width: PROFILE_IMAGE_SIZE,
      height: PROFILE_IMAGE_SIZE,
      cropperCircleOverlay: true,
      forceJpg: true,
      compressImageQuality: COMPRESS_QUALITY,
    });
    return { uri: image.path, mime: UPLOAD_MIME, fileName: UPLOAD_FILE_NAME };
  } catch (error) {
    if (isPickerCancelled(error)) {
      return null;
    }
    console.warn('이미지 선택 실패', error);
    return null;
  }
}
