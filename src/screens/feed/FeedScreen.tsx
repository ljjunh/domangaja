import { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Layout } from '@/shared/components/layout';
import { MAIN_TAB_SCREEN_EDGES } from '@/shared/constants/layout';
import { useMainTabBarSpace } from '@/shared/hooks/useMainTabBarSpace';
import { overlay } from '@/shared/overlay';
import { showToast } from '@/shared/lib/toast';
import { requestLocationPermission } from '@/domains/feed/lib/locationPermission';
import { useCurrentLocation } from '@/domains/feed/hooks/useCurrentLocation';
import { FeedList, LocationPermissionSheet, StoryList } from '@/domains/feed/components';
import { CommunityFab, CommunityTabs, type CommunityTabValue } from './components';

export default function FeedScreen() {
  const navigation = useNavigation();
  const mainTabBarSpace = useMainTabBarSpace();
  const fabBottomSpace = useMainTabBarSpace({ fromPhysicalBottom: true });
  const [tab, setTab] = useState<CommunityTabValue>('story');
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const { getCurrentCoordinates, LocationProbe } = useCurrentLocation();
  // 권한 요청/안내 시트가 진행 중인 동안 + 재탭으로 요청·시트가 중복되지 않도록 막는다
  const isBusyRef = useRef(false);

  // 시트는 스스로 퇴장 애니메이션을 돌린 뒤 onClose를 부르므로 unmount만 연결
  const openPermissionSheet = () => {
    overlay.open(({ unmount }) => (
      <LocationPermissionSheet
        onClose={() => {
          isBusyRef.current = false;
          unmount();
        }}
      />
    ));
  };

  const handlePressFab = async () => {
    if (isBusyRef.current) {
      return;
    }
    isBusyRef.current = true;
    setIsResolvingLocation(true);

    const permission = await requestLocationPermission();
    if (permission === 'blocked') {
      setIsResolvingLocation(false);
      openPermissionSheet(); // isBusyRef는 시트가 닫힐 때 풀린다
      return;
    }
    // retriable(안드로이드 1회 거절)은 조용히 종료 — 작성 페이지로 이동하지 않는다
    if (permission !== 'granted') {
      isBusyRef.current = false;
      setIsResolvingLocation(false);
      return;
    }

    const result = await getCurrentCoordinates();
    isBusyRef.current = false;
    setIsResolvingLocation(false);

    if (result.status !== 'success') {
      showToast('error', '현재 위치를 가져오지 못했어요. 잠시 후 다시 시도해주세요.');
      return;
    }

    const params = { latitude: result.coords.latitude, longitude: result.coords.longitude };
    if (tab === 'story') {
      navigation.navigate('StoryWrite', params);
    } else {
      navigation.navigate('FeedWrite', params);
    }
  };

  return (
    <Layout edges={MAIN_TAB_SCREEN_EDGES}>
      <CommunityTabs value={tab} onChange={setTab} />
      {tab === 'story' ? (
        <StoryList bottomInset={mainTabBarSpace} />
      ) : (
        <FeedList bottomInset={mainTabBarSpace} />
      )}
      <CommunityFab
        onPress={handlePressFab}
        bottomOffset={fabBottomSpace + 12}
        loading={isResolvingLocation}
      />
      {LocationProbe}
    </Layout>
  );
}
