import { createStaticNavigation, createNavigationContainerRef } from '@react-navigation/native';
import { RootStack } from '@/shared/navigations/RootStack';

export const navigationRef = createNavigationContainerRef();

const StaticNavigation = createStaticNavigation(RootStack);

// TODO: 프로젝트명과 내부의 기존 `domangaja` 식별자와 브랜드 영문 표기 통일을 검토
const DEEP_LINK_PREFIX = 'domanggaja://';

interface NavigationProps {
  onReady?: () => void;
}

export function Navigation({ onReady }: NavigationProps) {
  return (
    <StaticNavigation
      ref={navigationRef}
      linking={{ prefixes: [DEEP_LINK_PREFIX] }}
      onReady={onReady}
    />
  );
}
