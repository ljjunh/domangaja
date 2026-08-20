import { useCallback, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, type UserLocationChangeEvent } from 'react-native-maps';

const LOCATION_TIMEOUT_MS = 10_000;

export type CurrentLocationResult =
  | { status: 'success'; coords: { latitude: number; longitude: number } }
  | { status: 'error' };

export function useCurrentLocation() {
  const [isProbing, setIsProbing] = useState(false);
  const resolveRef = useRef<((result: CurrentLocationResult) => void) | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback((result: CurrentLocationResult) => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsProbing(false);
    const resolve = resolveRef.current;
    resolveRef.current = null;
    resolve?.(result);
  }, []);

  // 호출부(FeedScreen)가 중복 탭을 이미 막고 있어 동시 호출은 가정하지 않는다
  const getCurrentCoordinates = useCallback((): Promise<CurrentLocationResult> => {
    return new Promise(resolve => {
      resolveRef.current = resolve;
      setIsProbing(true);
      timeoutRef.current = setTimeout(() => finish({ status: 'error' }), LOCATION_TIMEOUT_MS);
    });
  }, [finish]);

  const handleUserLocationChange = useCallback(
    (event: UserLocationChangeEvent) => {
      const coordinate = event.nativeEvent.coordinate;
      if (coordinate == null) {
        finish({ status: 'error' });
        return;
      }
      finish({
        status: 'success',
        coords: { latitude: coordinate.latitude, longitude: coordinate.longitude },
      });
    },
    [finish],
  );

  // 화면 밖 멀리 렌더링 — 숨기되 네이티브 위치 갱신은 계속 동작해야 하므로 opacity/크기 0 대신 위치를 밀어낸다
  const LocationProbe = isProbing ? (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.hidden}
      showsUserLocation
      onUserLocationChange={handleUserLocationChange}
      pointerEvents="none"
    />
  ) : null;

  return { getCurrentCoordinates, LocationProbe };
}

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    top: -9999,
    left: -9999,
    width: 100,
    height: 100,
  },
});
