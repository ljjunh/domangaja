import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SpotMarker } from '@/domains/spot/components';

// 첫 단계: 확인용 초기 위치 (충북 단양)
const INITIAL_REGION = {
  latitude: 36.9846,
  longitude: 128.3655,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

// 서버 연동 시 지도 영역(bounds) 조회 응답으로 대체
const MOCK_MAP_SPOTS = [
  { id: 1, name: '만천하스카이워크', latitude: 36.9421, longitude: 128.3703, quietness: 99 },
  { id: 2, name: '도담삼봉', latitude: 37.0002, longitude: 128.3428, quietness: 91 },
  { id: 3, name: '단양강 잔도', latitude: 36.9668, longitude: 128.3532, quietness: 54 },
  { id: 4, name: '구인사', latitude: 37.0435, longitude: 128.4577, quietness: 58 },
  { id: 5, name: '사인암', latitude: 36.8973, longitude: 128.4174, quietness: 30 },
  { id: 6, name: '온달관광지', latitude: 37.0603, longitude: 128.4869, quietness: 25 },
  { id: 7, name: '다누리아쿠아리움', latitude: 36.9856, longitude: 128.3708, quietness: 14 },
];

export default function MapScreen() {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFill}
      initialRegion={INITIAL_REGION}
      showsCompass={false}
    >
      {MOCK_MAP_SPOTS.map(spot => (
        <Marker
          key={spot.id}
          coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <SpotMarker quietness={spot.quietness} />
        </Marker>
      ))}
    </MapView>
  );
}
