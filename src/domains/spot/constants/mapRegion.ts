import type { Region } from 'react-native-maps';

// KTO 데이터가 한국뿐이라, 위치를 못 얻거나 해외에서 접속했을 때 여기로 떨어진다
export const FALLBACK_REGION: Region = {
  // 서울시청
  latitude: 37.5665,
  longitude: 126.978,
  // "내 주변"으로 읽히는 줌 (세로 약 6.6km).
  // 0.3을 넘기면 "화면 대각선 40km 초과 시 최대 3,000곳" 제약에 걸려
  // 가장자리 관광지가 빠지므로 그 아래에서 조절한다
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

// 한국 대략 경계 — 제주·울릉도까지 포함
const KOREA_BOUNDS = {
  south: 33.0,
  north: 38.7,
  west: 124.5,
  east: 132.0,
};

/**
 * 우리 데이터가 닿는 범위인지. 도쿄에서 앱을 켜면 그 좌표로 가도 지도가 텅 비므로
 * 서비스 지역 밖이면 폴백으로 보낸다
 */
export function isInKorea(latitude: number, longitude: number): boolean {
  return (
    latitude >= KOREA_BOUNDS.south &&
    latitude <= KOREA_BOUNDS.north &&
    longitude >= KOREA_BOUNDS.west &&
    longitude <= KOREA_BOUNDS.east
  );
}

/** 좌표를 폴백과 같은 줌의 region으로 만든다 */
export function toRegion(latitude: number, longitude: number): Region {
  return {
    latitude,
    longitude,
    latitudeDelta: FALLBACK_REGION.latitudeDelta,
    longitudeDelta: FALLBACK_REGION.longitudeDelta,
  };
}
