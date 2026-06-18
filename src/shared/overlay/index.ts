import { createOverlay } from './createOverlay';

// 앱 전역에서 쓰는 기본 overlay 인스턴스
export const {
  /**
   * 오버레이 액션 객체. open/openAsync/close/unmount/closeAll/unmountAll 보유
   * 훅이 아니라 일반 객체라 컴포넌트 밖(이벤트 핸들러/유틸 등)에서도 호출 가능
   * 예) overlay.open(({ isOpen, close }) => <MyModal ... />)
   */
  overlay,
  /**
   * 앱(또는 오버레이를 쓸 영역)을 감싸는 Provider
   * 상위에 없으면 useCurrentOverlay/useOverlayData가 throw
   */
  OverlayProvider,
  // [훅] 현재 최상단(활성) 오버레이의 id. 없으면 null (컴포넌트 안에서만)
  useCurrentOverlay,
  // [훅] 전체 오버레이 상태(id → 정보) 조회 (컴포넌트 안에서만)
  useOverlayData,
} = createOverlay();

// 기본 인스턴스와 격리된 별도 overlay 필요할때
export function experimental_createOverlayContext() {
  return createOverlay();
}

export { createUseExternalEvents, isClientEnvironment } from './event';

export type {
  OverlayAsyncControllerComponent,
  OverlayAsyncControllerProps,
  OverlayControllerComponent,
  OverlayControllerProps,
} from './types';
