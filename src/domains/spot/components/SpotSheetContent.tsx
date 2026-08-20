import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Tab } from '@/shared/components/ui';
import SpotSheetHeader from './SpotSheetHeader';
import QuietnessCalendar from './QuietnessCalendar';
import SpotTourInfo from './SpotTourInfo';

interface SpotSheetContentProps {
  contentId: string;
  name: string;
  region: string;
  category: string;
  // 법정동 코드 — 일자별 한적도 조회에 필요
  areaCode: string;
  sigunguCode: string;
  audioGuide?: ReactNode;
}

export default function SpotSheetContent({
  contentId,
  name,
  region,
  category,
  areaCode,
  sigunguCode,
  audioGuide,
}: SpotSheetContentProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <View style={styles.container}>
      <SpotSheetHeader name={name} region={region} category={category} />
      <Tab value={activeTab} onChange={setActiveTab} size="small">
        <Tab.Item value="calendar">{t('spotSheet.tabs.calendar')}</Tab.Item>
        <Tab.Item value="tourInfo">{t('spotSheet.tabs.tourInfo')}</Tab.Item>
      </Tab>
      {activeTab === 'calendar' ? (
        <QuietnessCalendar areaCode={areaCode} sigunguCode={sigunguCode} touristSpot={name} />
      ) : (
        <SpotTourInfo contentId={contentId} audioGuide={audioGuide} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
});
