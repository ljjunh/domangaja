import type { ImageSourcePropType } from 'react-native';
import type { IllustratedSpotTheme, SpotTheme } from '@/shared/types/spotTheme';

// @2x, @3x는 같은 폴더에 두면 Metro가 기기 밀도에 맞춰 자동으로 고름
// Record라서 테마가 추가되면 여기서 타입 에러로 잡힌다

/** 1.6:1 — 온보딩 풍경 카드. ETC(기타)는 고를 대상이 아니라 없다 */
const WIDE_IMAGES: Record<IllustratedSpotTheme, ImageSourcePropType> = {
  SEA: require('./wide/sea.png'),
  MOUNTAIN: require('./wide/mountain.png'),
  ISLAND: require('./wide/island.png'),
  FIELD: require('./wide/field.png'),
  NIGHT_SKY: require('./wide/night-sky.png'),
  VALLEY: require('./wide/valley.png'),
  CITY: require('./wide/city.png'),
};

/** 1:1 — 홈 인기 테마 카드. 서버가 ETC를 집계에 포함할 수 있어 8종 전부 갖춘다 */
const SQUARE_IMAGES: Record<SpotTheme, ImageSourcePropType> = {
  SEA: require('./square/sea.png'),
  MOUNTAIN: require('./square/mountain.png'),
  ISLAND: require('./square/island.png'),
  FIELD: require('./square/field.png'),
  NIGHT_SKY: require('./square/night-sky.png'),
  VALLEY: require('./square/valley.png'),
  CITY: require('./square/city.png'),
  ETC: require('./square/etc.png'),
};

export const SPOT_THEME_IMAGES = {
  wide: WIDE_IMAGES,
  square: SQUARE_IMAGES,
};
