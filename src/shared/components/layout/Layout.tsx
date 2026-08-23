import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
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
  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor }]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
