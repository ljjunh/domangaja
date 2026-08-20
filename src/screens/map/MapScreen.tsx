import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { QuietnessLegend, SpotMarker, SpotSheetContent } from '@/domains/spot/components';
import { spotQueries } from '@/domains/spot/api/queries';
import type { MapSpot } from '@/domains/spot/types/api';
import { BaseSheet } from '@/shared/components/overlay';
import { colors } from '@/shared/constants/colors';
import { useMainTabBarSpace } from '@/shared/hooks/useMainTabBarSpace';
import { toServerLocale } from '@/shared/i18n/serverLocale';
import {
  createSpotClusterIndex,
  getExpansionRegion,
  getSpotClusters,
  type SpotClusterItem,
} from './utils/cluster';
import { ClusterMarker, MapSearchButton, MapSpotAudioGuide } from './components';

// 첫 단계: 확인용 초기 위치 (충북 단양)
const INITIAL_REGION: Region = {
  latitude: 36.9846,
  longitude: 128.3655,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const EXPANSION_DURATION = 300;

// 원·점은 도형 중심이, 핀은 꼬리 끝이 좌표에 놓여야 한다
const CENTER_ANCHOR = { x: 0.5, y: 0.5 };
const PIN_ANCHOR = { x: 0.5, y: 1 };

export default function MapScreen() {
  const { i18n } = useTranslation();
  // 지도는 SafeArea 밖까지 그려지므로 물리 바닥 기준으로 탭바를 피한다
  const mainTabBarSpace = useMainTabBarSpace({ fromPhysicalBottom: true });
  const mapRef = useRef<MapView>(null);
  const [selectedSpot, setSelectedSpot] = useState<MapSpot | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  // 지금 보이는 영역. 클러스터를 다시 묶으려면 필요해서 state로 둔다
  // (onRegionChangeComplete는 제스처가 끝날 때 한 번만 발화한다)
  const [viewRegion, setViewRegion] = useState<Region>(INITIAL_REGION);
  // 검색 기준 영역. 버튼을 누른 시점에만 갱신된다 — 지도를 움직일 때마다 바뀌면
  // 쿼리키가 매번 달라져 캐시가 무의미해지고 요청도 쏟아진다
  const [searchedRegion, setSearchedRegion] = useState<Region>(INITIAL_REGION);

  const { data: spots, isFetching } = useQuery(
    spotQueries.getMapSpots({
      lat: searchedRegion.latitude,
      lng: searchedRegion.longitude,
      latitudeDelta: searchedRegion.latitudeDelta,
      longitudeDelta: searchedRegion.longitudeDelta,
      lang: toServerLocale(i18n.language),
    }),
  );

  // 인덱스 생성은 비싸서 목록이 바뀔 때만, 질의는 지도가 움직일 때마다
  const clusterIndex = useMemo(() => createSpotClusterIndex(spots ?? []), [spots]);
  const clusters = useMemo(
    () => getSpotClusters(clusterIndex, viewRegion),
    [clusterIndex, viewRegion],
  );

  const searchCurrentArea = () => {
    setSelectedSpot(null);
    setSearchedRegion(viewRegion);
  };

  const pressCluster = (item: SpotClusterItem) => {
    const region = getExpansionRegion(clusterIndex, item, viewRegion);
    if (region != null) {
      mapRef.current?.animateToRegion(region, EXPANSION_DURATION);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        showsCompass={false}
        onMapReady={() => setIsMapReady(true)}
        onRegionChangeComplete={setViewRegion}
        onPress={e => {
          // 마커 탭도 지도 press를 발화시킨다(action: 'marker-press') — 빈 곳 탭일 때만 닫기
          if (e.nativeEvent.action === 'marker-press') {
            return;
          }
          setSelectedSpot(null);
        }}
      >
        {clusters.map(item => (
          <Marker
            key={item.key}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            anchor={item.spot?.quietnessScore == null ? CENTER_ANCHOR : PIN_ANCHOR}
            onPress={() => (item.spot == null ? pressCluster(item) : setSelectedSpot(item.spot))}
          >
            {item.spot == null ? (
              <ClusterMarker count={item.count} />
            ) : (
              <SpotMarker quietness={item.spot.quietnessScore} />
            )}
          </Marker>
        ))}
      </MapView>

      <View style={styles.searchButton} pointerEvents="box-none">
        <MapSearchButton isSearching={isFetching} onPress={searchCurrentArea} />
      </View>

      {/* 시트가 열리면 하단을 덮고, 시트 안 캘린더에 같은 범례가 이미 있다 */}
      {selectedSpot == null && (
        <View style={[styles.legend, { bottom: mainTabBarSpace }]} pointerEvents="none">
          <QuietnessLegend withUnmeasured />
        </View>
      )}

      {!isMapReady && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.blue[500]} />
        </View>
      )}
      {selectedSpot != null && (
        <BaseSheet avoidMainTabBar withBackdrop={false} onClose={() => setSelectedSpot(null)}>
          <SpotSheetContent
            contentId={selectedSpot.contentId}
            name={selectedSpot.title}
            region={selectedSpot.address}
            category={selectedSpot.contentTypeId}
            areaCode={selectedSpot.areaCode}
            sigunguCode={selectedSpot.sigunguCode}
            audioGuide={<MapSpotAudioGuide spot={selectedSpot} />}
          />
        </BaseSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchButton: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
  },
  legend: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    boxShadow: '0 2 8 0 rgba(0, 0, 0, 0.15)',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
