import type { ImageSourcePropType } from 'react-native';

export const example1Image: ImageSourcePropType = require('./example-1.jpeg');
export const example2Image: ImageSourcePropType = require('./example-2.jpeg');

// 서버 이미지가 없는 도망지의 폴백 (@2x·@3x는 Metro가 알아서 고른다)
export const placeholderImage: ImageSourcePropType = require('./placeholder.jpg');
