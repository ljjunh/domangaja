import { View } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface SpotSheetHeaderProps {
  name: string;
  region: string;
  category: string;
}

export default function SpotSheetHeader({ name, region, category }: SpotSheetHeaderProps) {
  return (
    <View>
      <Text typography="t4" weight="semiBold">
        {name}
      </Text>
      <Text typography="t6" weight="medium" color={colors.grey[600]}>
        {region}
        {' · '}
        {category}
      </Text>
    </View>
  );
}
