import ImagePicker from 'react-native-image-crop-picker';

const PROFILE_IMAGE_SIZE = 400;

function isPickerCancelled(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'E_PICKER_CANCELLED'
  );
}

export async function pickSquareImage(): Promise<string | null> {
  try {
    const image = await ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      width: PROFILE_IMAGE_SIZE,
      height: PROFILE_IMAGE_SIZE,
      cropperCircleOverlay: true,
    });
    return image.path;
  } catch (error) {
    if (isPickerCancelled(error)) {
      return null;
    }
    console.warn('이미지 선택 실패', error);
    return null;
  }
}
