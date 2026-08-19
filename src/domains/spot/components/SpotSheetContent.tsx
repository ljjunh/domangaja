import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Tab } from '@/shared/components/ui';
import { spotQueries } from '@/domains/spot/api/queries';
import { hasCongestionData } from '@/domains/spot/utils/congestion';
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
  const [selectedTab, setSelectedTab] = useState('calendar');

  // 캘린더 탭을 띄울 값이 있는지만 본다. 캘린더가 보이는 달로 다시 조회할 때
  // 같은 쿼리키를 쓰므로 이 조회가 요청을 더 만들지는 않는다
  const today = new Date();
  const { data: congestion, isPending } = useQuery(
    spotQueries.getCongestion({
      areaCode,
      sigunguCode,
      touristSpot: name,
      year: today.getFullYear(),
      month: today.getMonth() + 1,
    }),
  );

  // 측정 대상 여부를 알기 전에는 아래를 아예 그리지 않는다.
  // 캘린더를 먼저 그리면 시트가 캘린더 높이까지 커졌다가 줄어들며 튄다 — 늘어나기만 하게
  const hasCalendarTab = hasCongestionData(congestion);
  // 탭이 하나면 선택 상태를 따로 들고 있을 필요가 없다 (동기화 대신 유도)
  const activeTab = hasCalendarTab ? selectedTab : 'tourInfo';

  return (
    <View style={styles.container}>
      <SpotSheetHeader name={name} region={region} category={category} />
      {!isPending && (
        <>
          {hasCalendarTab && (
            <Tab value={activeTab} onChange={setSelectedTab} size="small">
              <Tab.Item value="calendar">{t('spotSheet.tabs.calendar')}</Tab.Item>
              <Tab.Item value="tourInfo">{t('spotSheet.tabs.tourInfo')}</Tab.Item>
            </Tab>
          )}
          {activeTab === 'calendar' ? (
            <QuietnessCalendar areaCode={areaCode} sigunguCode={sigunguCode} touristSpot={name} />
          ) : (
            <SpotTourInfo contentId={contentId} audioGuide={audioGuide} />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
});
