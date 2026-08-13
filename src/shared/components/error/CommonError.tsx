import { useTranslation } from 'react-i18next';
import { colors } from '@/shared/constants/colors';
import { InfoCircleFillIcon } from '@/assets/icons/common';
import ErrorView from './ErrorView';

interface CommonErrorProps {
  onRetry: () => void;
}

export default function CommonError({ onRetry }: CommonErrorProps) {
  const { t } = useTranslation();

  return (
    <ErrorView
      icon={InfoCircleFillIcon}
      iconColor={colors.blue[500]}
      iconBadgeColor={colors.grey[100]}
      title={t('error.common.title')}
      description={t('error.common.description')}
      onRetry={onRetry}
    />
  );
}
