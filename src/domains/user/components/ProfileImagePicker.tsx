import { StyleSheet } from 'react-native';
import { Image, Pressable } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { pickSquareImage } from '../lib/imagePicker';
import type { UploadFile } from '@/shared/api/service';

interface ProfileImagePickerProps {
  imageUri: string | null;
  onChange: (image: UploadFile) => void;
}

const IMAGE_SIZE = 100;

export default function ProfileImagePicker({ imageUri, onChange }: ProfileImagePickerProps) {
  const handlePress = async () => {
    const image = await pickSquareImage();
    if (image != null) {
      onChange(image);
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
