import { FadeInDown } from 'react-native-reanimated';

// 온보딩 스텝 요소 공통
export const stepEntering = (delayMs = 0) =>
  FadeInDown.springify()
    .stiffness(700)
    .damping(70)
    .delay(delayMs)
    .withInitialValues({ transform: [{ translateY: 300 }] });
