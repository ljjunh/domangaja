import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface FormSectionLabelProps {
  title: string;
  /**
   * @default false
   */
  required?: boolean;
}

export default function FormSectionLabel({ title, required = false }: FormSectionLabelProps) {
  return (
    <Text typography="t6" weight="bold" color={colors.grey[900]}>
      {title}
      {required && (
        <Text typography="t6" weight="bold" color={colors.red[500]}>
          {' '}
          *
        </Text>
      )}
    </Text>
  );
}
