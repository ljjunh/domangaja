import { createStaticNavigation, createNavigationContainerRef } from '@react-navigation/native';
import { RootStack } from '@/shared/navigations/RootStack';

export const navigationRef = createNavigationContainerRef();

const StaticNavigation = createStaticNavigation(RootStack);

const DEEP_LINK_PREFIX = 'domangaja://';

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
