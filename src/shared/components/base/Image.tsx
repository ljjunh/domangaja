import { type Ref } from 'react';
import { Image as RNImage, ImageProps as RNImageProps } from 'react-native';

export interface ImageProps extends RNImageProps {
  ref?: Ref<RNImage>;
}

export default function Image({ ref, ...rest }: ImageProps) {
  return <RNImage ref={ref} fadeDuration={0} {...rest} />;
}
