import { useCallback, useEffect, useReducer, useRef, type ReactNode } from 'react';
import { createOverlayContext } from './context';
import { createUseExternalEvents } from './event';
import { OverlayController } from './OverlayController';
import { overlayReducer } from './overlayReducer';
import type { OverlayAsyncControllerComponent, OverlayControllerComponent } from './types';

function createRandomId() {
  return `overlay-kit-${Math.random().toString(36).slice(2, 11)}`;
}

type OpenEventPayload = {
  controller: OverlayControllerComponent;
  overlayId: string;
  componentKey: string;
};

/**
 * overlay 액션 객체(open/close/...) 생성
 * 각 액션은 이벤트를 emit하고, Provider가 그 이벤트를 받아 reducer로 상태 변경
 */
function createOverlayStore(prefix: string) {
  const [useOverlayEvent, createEvent] = createUseExternalEvents<{
    open: (payload: OpenEventPayload) => void;
    close: (overlayId: string) => void;
    unmount: (overlayId: string) => void;
    closeAll: () => void;
    unmountAll: () => void;
  }>(`${prefix}/overlay-kit`);

  const open = (controller: OverlayControllerComponent, options?: { overlayId?: string }) => {
    const overlayId = options?.overlayId ?? createRandomId();
    const componentKey = createRandomId();
    createEvent('open')({ controller, overlayId, componentKey });
    return overlayId;
  };

  // close에 넘긴 값을 resolve, reject 가능. 닫히면 Promise가 결정됨
  const openAsync = <T,>(
    controller: OverlayAsyncControllerComponent<T>,
    options?: { overlayId?: string },
  ) =>
    new Promise<T>((resolve, reject) => {
      open(props => {
        const close = (param: T) => {
          resolve(param);
          props.close();
        };
        const overlayReject = (reason?: unknown) => {
          reject(reason);
          props.close();
        };
        return controller({ ...props, close, reject: overlayReject });
      }, options);
    });

  const close = createEvent('close');
  const unmount = createEvent('unmount');
  const closeAll = createEvent('closeAll');
  const unmountAll = createEvent('unmountAll');

  return { open, openAsync, close, unmount, closeAll, unmountAll, useOverlayEvent };
}

//독립된 overlay 인스턴스(액션 + Provider + 훅)를 생성
export function createOverlay() {
  const randomId = createRandomId();
  const { useOverlayEvent, ...overlay } = createOverlayStore(randomId);
  const { OverlayContextProvider, useCurrentOverlay, useOverlayData } = createOverlayContext();

  function OverlayProvider({ children }: { children?: ReactNode }) {
    const [overlayState, overlayDispatch] = useReducer(overlayReducer, {
      current: null,
      overlayOrderList: [],
      overlayData: {},
    });
    const prevOverlayStateRef = useRef(overlayState);

    const open = useCallback(({ controller, overlayId, componentKey }: OpenEventPayload) => {
      overlayDispatch({
        type: 'ADD',
        overlay: { id: overlayId, componentKey, isOpen: false, isMounted: false, controller },
      });
    }, []);
    const close = useCallback(
      (overlayId: string) => overlayDispatch({ type: 'CLOSE', overlayId }),
      [],
    );
    const unmount = useCallback(
      (overlayId: string) => overlayDispatch({ type: 'REMOVE', overlayId }),
      [],
    );
    const closeAll = useCallback(() => overlayDispatch({ type: 'CLOSE_ALL' }), []);
    const unmountAll = useCallback(() => overlayDispatch({ type: 'REMOVE_ALL' }), []);

    // overlay.open() 등이 emit한 이벤트를 여기서 받아 dispatch
    useOverlayEvent({ open, close, unmount, closeAll, unmountAll });

    // 이미 마운트된 오버레이를 같은 id로 다시 열 때(닫힘→열림) OPEN을 한 프레임 뒤 재트리거
    if (prevOverlayStateRef.current !== overlayState) {
      overlayState.overlayOrderList.forEach(overlayId => {
        const prevData = prevOverlayStateRef.current.overlayData;
        const currData = overlayState.overlayData;
        if (prevData[overlayId] != null && prevData[overlayId].isMounted === true) {
          const wasClosed = prevData[overlayId].isOpen === false;
          const isOpenNow = currData[overlayId].isOpen === true;
          if (wasClosed && isOpenNow) {
            requestAnimationFrame(() => overlayDispatch({ type: 'OPEN', overlayId }));
          }
        }
      });
      prevOverlayStateRef.current = overlayState;
    }

    // 언마운트 시 전체 정리
    useEffect(() => () => overlayDispatch({ type: 'REMOVE_ALL' }), []);

    return (
      <OverlayContextProvider value={overlayState}>
        {children}
        {overlayState.overlayOrderList.map(overlayId => {
          const { id, componentKey, isOpen, controller } = overlayState.overlayData[overlayId];
          return (
            <OverlayController
              key={componentKey}
              isOpen={isOpen}
              controller={controller}
              overlayId={id}
              overlayDispatch={overlayDispatch}
            />
          );
        })}
      </OverlayContextProvider>
    );
  }

  return { overlay, OverlayProvider, useCurrentOverlay, useOverlayData };
}
