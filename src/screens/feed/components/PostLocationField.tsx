import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/base';
import { Border } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { LocationFillIcon } from '@/assets/icons/common';
import FormSectionLabel from './FormSectionLabel';

interface PostLocationFieldProps {
  // GPS로 자동 할당되는 읽기 전용 위치 표시 — 직접 입력/검색/수정 UI 아님
  address: string;
}

export default function PostLocationField({ address }: PostLocationFieldProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <FormSectionLabel title={t('feed.postForm.location')} />
      <View style={styles.row}>
        <LocationFillIcon width={18} height={18} color={colors.blue[500]} />
        <Text typography="st10" weight="semiBold" color={colors.grey[800]}>
          {address}
        </Text>
      </View>
      <Border />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
