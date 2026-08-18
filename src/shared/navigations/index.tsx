import { createStaticNavigation, createNavigationContainerRef } from '@react-navigation/native';
import { RootStack } from '@/shared/navigations/RootStack';

export const navigationRef = createNavigationContainerRef();

const StaticNavigation = createStaticNavigation(RootStack);

interface NavigationProps {
  onReady?: () => void;
}

export function Navigation({ onReady }: NavigationProps) {
  return <StaticNavigation ref={navigationRef} onReady={onReady} />;
}
