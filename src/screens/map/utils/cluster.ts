import Supercluster, { type PointFeature } from 'supercluster';
import type { Region } from 'react-native-maps';
import type { MapSpot } from '@/domains/spot/types/api';

// 화면상 이 픽셀 반경 안에 들어오는 마커끼리 묶는다
const CLUSTER_RADIUS = 60;
// 이 줌보다 확대하면 더 이상 묶지 않고 개별 마커로 편다
const CLUSTER_MAX_ZOOM = 16;

interface SpotProperties {
  contentId: string;
}

export interface SpotClusterIndex {
  index: Supercluster<SpotProperties>;
  spotById: Map<string, MapSpot>;
}

export interface SpotClusterItem {
  key: string;
  latitude: number;
  longitude: number;
  /** 2 이상이면 묶인 클러스터 */
  count: number;
  /** 클러스터일 때만 — 탭 시 어디까지 확대해야 풀리는지 물어보는 데 쓴다 */
  clusterId: number | null;
  /** 개별 스팟일 때만 */
  spot: MapSpot | null;
}

// react-native-maps의 region에는 줌 레벨이 없다. supercluster는 타일 줌 단위로
// 격자를 나누므로, 보이는 경도 폭에서 역산한다 (전체 360도 = 줌 0)
function toZoomLevel(longitudeDelta: number): number {
  return Math.round(Math.log2(360 / Math.max(longitudeDelta, Number.EPSILON)));
}

// delta는 전체 폭이라 경계는 중심 ± delta / 2
function toBBox(region: Region): [number, number, number, number] {
  return [
    region.longitude - region.longitudeDelta / 2,
    region.latitude - region.latitudeDelta / 2,
    region.longitude + region.longitudeDelta / 2,
    region.latitude + region.latitudeDelta / 2,
  ];
}

/**
 * 인덱스 생성은 전체 포인트를 훑는 비싼 작업이라 목록이 바뀔 때만 다시 만든다.
 * 지도를 움직일 때는 만들어둔 인덱스에 getSpotClusters로 질의만 한다
 */
export function createSpotClusterIndex(spots: MapSpot[]): SpotClusterIndex {
  const index = new Supercluster<SpotProperties>({
    radius: CLUSTER_RADIUS,
    maxZoom: CLUSTER_MAX_ZOOM,
  });

  index.load(
    spots.map<PointFeature<SpotProperties>>(spot => ({
      type: 'Feature',
      properties: { contentId: spot.contentId },
      geometry: { type: 'Point', coordinates: [spot.longitude, spot.latitude] },
    })),
  );

  return {
    index,
    spotById: new Map(spots.map(spot => [spot.contentId, spot])),
  };
}

export function getSpotClusters(
  { index, spotById }: SpotClusterIndex,
  region: Region,
): SpotClusterItem[] {
  return index.getClusters(toBBox(region), toZoomLevel(region.longitudeDelta)).map(feature => {
    const [longitude, latitude] = feature.geometry.coordinates;

    // 개별 포인트와 클러스터가 같은 배열로 섞여 온다. 클러스터에만 있는 필드로 가른다
    if ('cluster' in feature.properties) {
      const { cluster_id, point_count } = feature.properties;
      return {
        key: `cluster-${cluster_id}`,
        latitude,
        longitude,
        count: point_count,
        clusterId: cluster_id,
        spot: null,
      };
    }

    const { contentId } = feature.properties;
    return {
      key: contentId,
      latitude,
      longitude,
      count: 1,
      clusterId: null,
      spot: spotById.get(contentId) ?? null,
    };
  });
}

/**
 * 클러스터를 탭했을 때 그것이 풀릴 만큼 확대된 region.
 * 화면 비율이 깨지지 않게 현재 region의 위/경도 비를 그대로 유지한다
 */
export function getExpansionRegion(
  { index }: SpotClusterIndex,
  item: SpotClusterItem,
  region: Region,
): Region | null {
  if (item.clusterId == null) {
    return null;
  }

  const zoom = index.getClusterExpansionZoom(item.clusterId);
  const longitudeDelta = 360 / Math.pow(2, zoom);

  return {
    latitude: item.latitude,
    longitude: item.longitude,
    longitudeDelta,
    latitudeDelta: longitudeDelta * (region.latitudeDelta / region.longitudeDelta),
  };
}
