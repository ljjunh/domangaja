import { StyleSheet } from 'react-native';
import { Pressable } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { ArrowRightLongIcon } from '@/assets/icons/common';

interface StepNextButtonProps {
  /**
   * @default false
   */
  disabled?: boolean;
  onPress: () => void;
}

export default function StepNextButton({ disabled = false, onPress }: StepNextButtonProps) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.disabled]}
      disabled={disabled}
      onPress={onPress}
    >
      <ArrowRightLongIcon color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center', // 부모의 stretch를 무시하고 내용 크기로
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 30,
    backgroundColor: colors.blue[500],
  },
  disabled: {
    opacity: 0.4,
  },
});
