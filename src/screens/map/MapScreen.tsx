import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type Region,
  type UserLocationChangeEvent,
} from 'react-native-maps';
import { QuietnessLegend, SpotMarker, SpotSheetContent } from '@/domains/spot/components';
import { spotQueries } from '@/domains/spot/api/queries';
import type { MapSpot } from '@/domains/spot/types/api';
import {
  getSpotContentTypeLabelKey,
  type SpotContentTypeId,
} from '@/domains/spot/constants/contentType';
import { FALLBACK_REGION, isInKorea, toRegion } from '@/domains/spot/constants/mapRegion';
import { BaseSheet, LocationPermissionSheet } from '@/shared/components/overlay';
import { overlay } from '@/shared/overlay';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { useMainTabBarSpace } from '@/shared/hooks/useMainTabBarSpace';
import { toServerLocale } from '@/shared/i18n/serverLocale';
import {
  checkLocationPermission,
  requestLocationPermission,
  type LocationPermissionResult,
} from '@/shared/lib/locationPermission';
import { storage } from '@/shared/utils/storage';
import { STORAGE_KEYS } from '@/shared/constants/storageKeys';
import {
  createSpotClusterIndex,
  getExpansionRegion,
  getSpotClusters,
  type SpotClusterItem,
} from './utils/cluster';
import {
  ClusterMarker,
  MapSearchButton,
  MapSpotAudioGuide,
  MyLocationButton,
  SpotTypeFilterChips,
} from './components';
import { IS_IOS } from '@/shared/constants/platform';

const EXPANSION_DURATION = 300;
const MOVE_DURATION = 500;
// GPS가 안 잡히는 실내·기내에서 무한정 기다리지 않는다
const LOCATION_TIMEOUT = 5_000;

// 첫 조회는 관광지로 — 필터가 항상 하나는 선택된 상태다
const DEFAULT_CONTENT_TYPE_ID: SpotContentTypeId = '12';

// 원·점은 도형 중심이, 핀은 꼬리 끝이 좌표에 놓여야 한다
const CENTER_ANCHOR = { x: 0.5, y: 0.5 };
const PIN_ANCHOR = { x: 0.5, y: 1 };

export default function MapScreen() {
  const { t, i18n } = useTranslation();
  // 지도는 SafeArea 밖까지 그려지므로 물리 바닥 기준으로 탭바를 피한다
  const mainTabBarSpace = useMainTabBarSpace({ fromPhysicalBottom: true });
  const mapRef = useRef<MapView>(null);
  const [selectedSpot, setSelectedSpot] = useState<MapSpot | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  // 지금 보이는 영역. 클러스터를 다시 묶으려면 필요해서 state로 둔다
  // (onRegionChangeComplete는 제스처가 끝날 때 한 번만 발화한다)
  const [viewRegion, setViewRegion] = useState<Region>(FALLBACK_REGION);
  // 검색 기준 영역. 버튼을 누른 시점에만 갱신된다 — 지도를 움직일 때마다 바뀌면
  // 쿼리키가 매번 달라져 캐시가 무의미해지고 요청도 쏟아진다.
  // null인 동안은 조회하지 않는다 — 위치가 정해지기 전에 쏘면 3,000건짜리 요청이 두 번 나간다
  const [searchedRegion, setSearchedRegion] = useState<Region | null>(null);
  const [contentTypeId, setContentTypeId] = useState<SpotContentTypeId>(DEFAULT_CONTENT_TYPE_ID);
  const [locationPermission, setLocationPermission] = useState<LocationPermissionResult | null>(
    null,
  );
  const [isLocating, setIsLocating] = useState(false);
  // onUserLocationChange는 계속 발화하므로, 요청한 순간에만 한 번 받아쓴다
  const locationResolveRef = useRef<((region: Region | null) => void) | null>(null);

  const { data: spots, isFetching } = useQuery({
    ...spotQueries.getMapSpots({
      lat: searchedRegion?.latitude ?? FALLBACK_REGION.latitude,
      lng: searchedRegion?.longitude ?? FALLBACK_REGION.longitude,
      latitudeDelta: searchedRegion?.latitudeDelta ?? FALLBACK_REGION.latitudeDelta,
      longitudeDelta: searchedRegion?.longitudeDelta ?? FALLBACK_REGION.longitudeDelta,
      contentTypeId: Number(contentTypeId),
      lang: toServerLocale(i18n.language),
    }),
    enabled: searchedRegion != null,
  });

  // 인덱스 생성은 비싸서 목록이 바뀔 때만, 질의는 지도가 움직일 때마다
  const clusterIndex = useMemo(() => createSpotClusterIndex(spots ?? []), [spots]);
  const clusters = useMemo(
    () => getSpotClusters(clusterIndex, viewRegion),
    [clusterIndex, viewRegion],
  );

  // 실제 지도의 showsUserLocation을 좌표 공급원으로 쓴다 (숨은 MapView를 하나 더 띄우지 않는다)
  const receiveUserLocation = (event: UserLocationChangeEvent) => {
    const coordinate = event.nativeEvent.coordinate;
    const resolve = locationResolveRef.current;
    if (resolve == null) {
      return;
    }
    locationResolveRef.current = null;
    resolve(
      coordinate == null || !isInKorea(coordinate.latitude, coordinate.longitude)
        ? null
        : toRegion(coordinate.latitude, coordinate.longitude),
    );
  };

  const getCurrentRegion = useCallback(() => {
    return new Promise<Region | null>(resolve => {
      locationResolveRef.current = resolve;
      setTimeout(() => {
        if (locationResolveRef.current === resolve) {
          locationResolveRef.current = null;
          resolve(null);
        }
      }, LOCATION_TIMEOUT);
    });
  }, []);

  const moveTo = (region: Region) => {
    mapRef.current?.animateToRegion(region, MOVE_DURATION);
    setSearchedRegion(region);
  };

  // 첫 진입: 저장된 위치로 카메라를 먼저 놓고, 권한을 물어 현재 위치가 잡히면 그쪽으로
  useEffect(
    function startFromBestKnownRegion() {
      let isMounted = true;

      const start = async () => {
        const savedRegion = await storage.get<Region>(STORAGE_KEYS.LAST_MAP_REGION);
        if (!isMounted) {
          return;
        }
        const initialRegion = savedRegion ?? FALLBACK_REGION;
        setViewRegion(initialRegion);
        mapRef.current?.animateToRegion(initialRegion, 0);

        const permission = await requestLocationPermission();
        if (!isMounted) {
          return;
        }
        setLocationPermission(permission);

        // 권한이 없으면 저장된 위치(없으면 서울)에서 그대로 조회한다
        if (permission !== 'granted') {
          setSearchedRegion(initialRegion);
          return;
        }

        const currentRegion = await getCurrentRegion();
        if (!isMounted) {
          return;
        }
        // 좌표를 못 얻거나 서비스 지역 밖이면 폴백
        setSearchedRegion(currentRegion ?? initialRegion);
        if (currentRegion != null) {
          mapRef.current?.animateToRegion(currentRegion, MOVE_DURATION);
        }
      };

      start();
      return () => {
        isMounted = false;
      };
    },
    [getCurrentRegion],
  );

  // 다음 방문에 여기서 시작하도록 마지막으로 조회한 영역을 남긴다
  useEffect(
    function rememberSearchedRegion() {
      if (searchedRegion != null) {
        storage.set(STORAGE_KEYS.LAST_MAP_REGION, searchedRegion);
      }
    },
    [searchedRegion],
  );

  // 메인탭 화면이라 전역 overlay에 띄운다 — 화면 트리 안에 그리면 떠 있는 탭바에 가려진다
  // (fullScreenModal 화면은 반대로 화면 트리에 직접 그려야 한다)
  const openPermissionSheet = () => {
    overlay.open(({ unmount }) => <LocationPermissionSheet onClose={unmount} />);
  };

  const moveToMyLocation = async () => {
    const permission =
      locationPermission === 'granted'
        ? await checkLocationPermission()
        : await requestLocationPermission();
    setLocationPermission(permission);

    if (permission === 'blocked') {
      openPermissionSheet();
      return;
    }
    // retriable(안드로이드 1회 거절)은 조용히 종료 — 다시 누르면 시스템이 한 번 더 묻는다
    if (permission !== 'granted') {
      return;
    }

    setIsLocating(true);
    const currentRegion = await getCurrentRegion();
    setIsLocating(false);
    if (currentRegion != null) {
      setSelectedSpot(null);
      moveTo(currentRegion);
    }
  };

  const searchCurrentArea = () => {
    setSelectedSpot(null);
    setSearchedRegion(viewRegion);
  };

  // 필터를 바꾸면 지금 보고 있는 영역 기준으로 다시 조회한다
  const selectContentType = (nextContentTypeId: SpotContentTypeId) => {
    setSelectedSpot(null);
    setContentTypeId(nextContentTypeId);
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
        initialRegion={FALLBACK_REGION}
        showsCompass={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        showsUserLocation={locationPermission === 'granted'}
        onUserLocationChange={receiveUserLocation}
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
            anchor={item.spot == null ? CENTER_ANCHOR : PIN_ANCHOR}
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

      <View style={styles.topOverlay} pointerEvents="box-none">
        <SpotTypeFilterChips
          selectedContentTypeId={contentTypeId}
          onSelectContentType={selectContentType}
        />
        <MapSearchButton isSearching={isFetching} onPress={searchCurrentArea} />
      </View>

      {selectedSpot == null && (
        <View style={[styles.myLocation, { bottom: mainTabBarSpace }]}>
          <MyLocationButton isLocating={isLocating} onPress={moveToMyLocation} />
        </View>
      )}

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
            category={t(getSpotContentTypeLabelKey(selectedSpot.contentTypeId))}
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
  topOverlay: {
    position: 'absolute',
    top: IS_IOS ? 60 : 40,
    left: 0,
    right: 0,
    gap: 10,
  },
  myLocation: {
    position: 'absolute',
    right: SCREEN_PADDING_HORIZONTAL,
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
