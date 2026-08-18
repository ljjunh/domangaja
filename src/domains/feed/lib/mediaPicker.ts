import ImagePicker from 'react-native-image-crop-picker';
import type { UploadFile } from '@/shared/api/service';

const CANCELLED_CODE = 'E_PICKER_CANCELLED';
const NO_PERMISSION_CODE = 'E_NO_LIBRARY_PERMISSION';

export type PickStoryMediaResult =
  | { status: 'picked'; file: UploadFile }
  | { status: 'cancelled' }
  | { status: 'noPermission' };

export type PickFeedPhotoResult =
  | { status: 'picked'; file: UploadFile }
  | { status: 'cancelled' }
  | { status: 'noPermission' };

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return (error as { code?: string }).code;
  }
  return undefined;
}

// 크롭 없이 사진/영상 원본 1개 선택
export async function pickStoryMedia(): Promise<PickStoryMediaResult> {
  try {
    const media = await ImagePicker.openPicker({ mediaType: 'any' });
    return {
      status: 'picked',
      file: {
        uri: media.path,
        mime: media.mime,
        fileName: media.filename ?? (media.mime.startsWith('video') ? 'story.mp4' : 'story.jpg'),
      },
    };
  } catch (error) {
    const code = getErrorCode(error);
    if (code === CANCELLED_CODE) {
      return { status: 'cancelled' };
    }
    // 권한 실패 처리
    if (code === NO_PERMISSION_CODE) {
      return { status: 'noPermission' };
    }
    console.warn('미디어 선택 실패', error);
    return { status: 'cancelled' };
  }
}

// 크롭 없이 사진 원본 1장만 선택 (피드는 영상 불가)
export async function pickFeedPhoto(): Promise<PickFeedPhotoResult> {
  try {
    const image = await ImagePicker.openPicker({ mediaType: 'photo' });
    return {
      status: 'picked',
      file: { uri: image.path, mime: image.mime, fileName: image.filename ?? 'feed.jpg' },
    };
  } catch (error) {
    const code = getErrorCode(error);
    if (code === CANCELLED_CODE) {
      return { status: 'cancelled' };
    }
    if (code === NO_PERMISSION_CODE) {
      return { status: 'noPermission' };
    }
    console.warn('이미지 선택 실패', error);
    return { status: 'cancelled' };
  }
}
