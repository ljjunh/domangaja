import { createStaticNavigation } from '@react-navigation/native';
import { RootStack } from '@/shared/navigations/RootStack';

export const Navigation = createStaticNavigation(RootStack);
