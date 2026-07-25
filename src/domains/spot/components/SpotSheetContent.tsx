import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <View style={styles.container}>
      <SpotSheetHeader name={name} region={region} category={category} />
      <Tab value={activeTab} onChange={setActiveTab} size="small">
        <Tab.Item value="calendar">캘린더</Tab.Item>
        <Tab.Item value="tourInfo">관광정보</Tab.Item>
      </Tab>
      {activeTab === 'calendar' ? <QuietnessCalendar /> : <SpotTourInfo />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
