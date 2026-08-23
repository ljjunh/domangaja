import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';
import { colors } from '@/shared/constants/colors';

interface LayoutProps {
  children: ReactNode;
  edges?: readonly Edge[];
  /**
   * @default colors.white
   */
  backgroundColor?: string;
}

const DEFAULT_EDGES: readonly Edge[] = ['top', 'bottom'];

export default function Layout({
  children,
  edges = DEFAULT_EDGES,
  backgroundColor = colors.white,
}: LayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.safe,
        { backgroundColor },
        edges.includes('top') && { paddingTop: insets.top },
        edges.includes('bottom') && { paddingBottom: insets.bottom },
        edges.includes('left') && { paddingLeft: insets.left },
        edges.includes('right') && { paddingRight: insets.right },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
