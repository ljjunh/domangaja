import { StyleSheet } from 'react-native';
import { Image, Pressable } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { pickSquareImage } from '../lib/imagePicker';

interface ProfileImagePickerProps {
  imageUri: string | null;
  onChange: (uri: string) => void;
}

const IMAGE_SIZE = 100;

export default function ProfileImagePicker({ imageUri, onChange }: ProfileImagePickerProps) {
  const handlePress = async () => {
    const uri = await pickSquareImage();
    if (uri) {
      onChange(uri);
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
