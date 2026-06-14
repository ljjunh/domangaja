import { Image as RNImage, ImageProps } from 'react-native';

export default function Image(props: ImageProps) {
  return <RNImage fadeDuration={0} {...props} />;
}
