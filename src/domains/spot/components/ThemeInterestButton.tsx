import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui';
import type { SpotTheme } from '@/shared/types/spotTheme';
import { userMutations, userQueries } from '@/domains/user/api/queries';

interface ThemeInterestButtonProps {
  theme: SpotTheme;
}

export default function ThemeInterestButton({ theme }: ThemeInterestButtonProps) {
  const { t } = useTranslation();
  const { data: me } = useQuery(userQueries.getMe());
  const { mutate: saveProfile, isPending } = useMutation(userMutations.saveProfile());

  if (me == null) {
    return null;
  }

  const isInterested = me.preferredCategories.includes(theme);
  const toggleInterest = () => {
    const preferredCategories = isInterested
      ? me.preferredCategories.filter(category => category !== theme)
      : [...me.preferredCategories, theme];

    saveProfile({ patch: { preferredCategories }, image: null });
  };

  return (
    <Button
      size="tiny"
      type={isInterested ? 'light' : 'primary'}
      onPress={toggleInterest}
      loading={isPending}
    >
      {t(isInterested ? 'spot.theme.result.removeInterest' : 'spot.theme.result.addInterest')}
    </Button>
  );
}
