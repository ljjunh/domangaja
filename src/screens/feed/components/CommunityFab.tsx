import { StyleSheet } from 'react-native';
import { Pressable } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { AddIcon } from '@/assets/icons/common';

interface CommunityFabProps {
  onPress: () => void;
  /**
   * 메인 탭바 위로 얼마나 띄울지 (useMainTabBarSpace 값 + 여백)
   */
  bottomOffset: number;
}

export default function CommunityFab({ onPress, bottomOffset }: CommunityFabProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="등록하기"
      style={[styles.fab, { bottom: bottomOffset }]}
    >
      <AddIcon color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 15,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.blue[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    borderColor: colors.white,
    backgroundColor: 'transparent',
  },
});
