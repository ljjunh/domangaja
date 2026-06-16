import { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { colors } from '@/shared/constants/colors';

interface LayoutProps {
  children: ReactNode;
  edges?: readonly Edge[];
  padded?: boolean;
  /**
   * @default colors.white
   */
  backgroundColor?: string;
  style?: ViewStyle;
}

const DEFAULT_EDGES: readonly Edge[] = ['top', 'bottom'];

export default function Layout({
  children,
  edges = DEFAULT_EDGES,
  padded = false,
  backgroundColor = colors.white,
  style,
}: LayoutProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor }]}>
      <View style={[styles.content, padded && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1 },
  padded: { paddingHorizontal: 15, paddingBottom: 12 },
});
