import { type Ref } from 'react';
import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from 'react-native';
import { colors } from '@/shared/constants/colors';

export interface SwitchProps extends RNSwitchProps {
  ref?: Ref<RNSwitch>;
}

export default function Switch({ ref, ...rest }: SwitchProps) {
  return (
    <RNSwitch
      ref={ref}
      trackColor={{ false: colors.grey[200], true: colors.blue[500] }}
      thumbColor={colors.white}
      ios_backgroundColor={colors.grey[200]}
      {...rest}
    />
  );
}
