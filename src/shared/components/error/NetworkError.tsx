import { useTranslation } from 'react-i18next';
import { colors } from '@/shared/constants/colors';
import { WifiOffIcon } from '@/assets/icons/common';
import ErrorView from './ErrorView';

interface NetworkErrorProps {
  onRetry: () => void;
}

export default function NetworkError({ onRetry }: NetworkErrorProps) {
  const { t } = useTranslation();

  return (
    <ErrorView
      icon={WifiOffIcon}
      iconColor={colors.blue[500]}
      iconBadgeColor={colors.grey[100]}
      title={t('error.network.title')}
      description={t('error.network.description')}
      onRetry={onRetry}
    />
  );
}
