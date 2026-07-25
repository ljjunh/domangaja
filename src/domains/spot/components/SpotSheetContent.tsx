import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Tab } from '@/shared/components/ui';
import SpotSheetHeader from './SpotSheetHeader';
import QuietnessCalendar from './QuietnessCalendar';
import SpotTourInfo from './SpotTourInfo';

interface SpotSheetContentProps {
  name: string;
  region: string;
  category: string;
}

export default function SpotSheetContent({ name, region, category }: SpotSheetContentProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <View style={styles.container}>
      <SpotSheetHeader name={name} region={region} category={category} />
      <Tab value={activeTab} onChange={setActiveTab} size="small">
        <Tab.Item value="calendar">{t('spotSheet.tabs.calendar')}</Tab.Item>
        <Tab.Item value="tourInfo">{t('spotSheet.tabs.tourInfo')}</Tab.Item>
      </Tab>
      {activeTab === 'calendar' ? <QuietnessCalendar /> : <SpotTourInfo />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
});
