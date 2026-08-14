import type { ImageSourcePropType } from 'react-native';
import type { OnboardingSpotTheme } from '@/shared/types/spotTheme';

// @2x, @3x는 같은 폴더에 두면 Metro가 기기 밀도에 맞춰 자동으로 고름
export const SPOT_THEME_IMAGES: Record<OnboardingSpotTheme, ImageSourcePropType> = {
  SEA: require('./sea.png'),
  MOUNTAIN: require('./mountain.png'),
  ISLAND: require('./island.png'),
  FIELD: require('./field.png'),
  NIGHT_SKY: require('./night-sky.png'),
  VALLEY: require('./valley.png'),
  CITY: require('./city.png'),
};
