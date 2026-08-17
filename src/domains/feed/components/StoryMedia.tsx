import { StyleSheet, type ImageSourcePropType } from 'react-native';
import { Image } from '@/shared/components/base';

interface StoryMediaProps {
  // 서버 연동 시 미디어 타입(이미지/영상)에 따라 이 안에서 분기해 영상 플레이어로 교체할 자리
  image: ImageSourcePropType;
}

export default function StoryMedia({ image }: StoryMediaProps) {
  return <Image source={image} style={styles.media} resizeMode="contain" />;
}

const styles = StyleSheet.create({
  media: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});
