import ImagePicker from 'react-native-image-crop-picker';
import type { UploadFile } from '@/shared/api/service';

const PROFILE_IMAGE_SIZE = 400;
const COMPRESS_QUALITY = 0.8;
const UPLOAD_MIME = 'image/jpeg';
const UPLOAD_FILE_NAME = 'profile.jpg';

// 라이브러리가 던지는 코드 (ImageCropPicker)
const CANCELLED_CODE = 'E_PICKER_CANCELLED';
const NO_PERMISSION_CODE = 'E_NO_LIBRARY_PERMISSION';

export type PickImageResult =
  | { status: 'picked'; image: UploadFile }
  | { status: 'cancelled' }
  | { status: 'noPermission' };

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return (error as { code?: string }).code;
  }
  return undefined;
}

export async function pickSquareImage(): Promise<PickImageResult> {
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
    return {
      status: 'picked',
      image: { uri: image.path, mime: UPLOAD_MIME, fileName: UPLOAD_FILE_NAME },
    };
  } catch (error) {
    const code = getErrorCode(error);
    if (code === CANCELLED_CODE) {
      return { status: 'cancelled' };
    }
    // 권한 실패를 취소와 구분한다 — 뭉치면 "탭했는데 아무 일도 안 남"이 된다
    if (code === NO_PERMISSION_CODE) {
      return { status: 'noPermission' };
    }
    console.warn('이미지 선택 실패', error);
    return { status: 'cancelled' };
  }
}
