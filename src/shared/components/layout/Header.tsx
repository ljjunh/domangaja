import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

interface HeaderProps {
  left?: ReactNode;
  right?: ReactNode;
}

export default function Header({ left, right }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>{left}</View>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 48,
  },
  side: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
