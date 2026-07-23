import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// 첫 단계: 확인용 초기 위치 (충북 단양)
const INITIAL_REGION = {
  latitude: 36.9846,
  longitude: 128.3655,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export default function MapScreen() {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFill}
      initialRegion={INITIAL_REGION}
    />
  );
}
