import { useLayoutEffect } from 'react';

/**
 * overlay.open() 같은 함수를 React 바깥에서 호출해도 Provider의 dispatch에 도달시키기 위해
 * 작은 이벤트 에미터를 둔다. open()은 이벤트를 emit하고, Provider는 그 이벤트를 구독
 */
type EventHandler = (payload?: unknown) => void;
type EventHandlerMap = Map<string, EventHandler[]>;

function createEmitter(all: EventHandlerMap = new Map()) {
  return {
    all,
    on(type: string, handler: EventHandler) {
      const handlers = all.get(type);
      if (handlers) {
        handlers.push(handler);
      } else {
        all.set(type, [handler]);
      }
    },
    off(type: string, handler?: EventHandler) {
      const handlers = all.get(type);
      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        } else {
          all.set(type, []);
        }
      }
    },
    emit(type: string, payload?: unknown) {
      all
        .get(type)
        ?.slice()
        .forEach(handler => handler(payload));
      all
        .get('*')
        ?.slice()
        .forEach(handler => (handler as (t: string, p?: unknown) => void)(type, payload));
    },
  };
}

const emitter = createEmitter();

// 브라우저(document) 혹은 React Native 환경인지
export function isClientEnvironment() {
  const globalEnv = globalThis as { document?: unknown; navigator?: { product?: string } };
  const hasDocument = typeof globalEnv.document !== 'undefined';
  const isReactNative =
    typeof globalEnv.navigator !== 'undefined' && globalEnv.navigator?.product === 'ReactNative';
  return hasDocument || isReactNative;
}

// SSR 안전: 클라이언트 환경에서만 useLayoutEffect, 아니면 no-op
const useIsomorphicLayoutEffect: typeof useLayoutEffect = isClientEnvironment()
  ? useLayoutEffect
  : () => {};

/**
 * prefix 네임스페이스로 외부 이벤트를 등록/발행하는 훅 쌍을 생성
 * - useExternalEvents(handlers): 이벤트 핸들러들을 에미터에 등록 (Provider에서 사용)
 * - createEvent(eventKey): 해당 이벤트를 발행하는 함수 반환 (overlay.open 등에서 사용)
 */
export function createUseExternalEvents<
  EventHandlers extends Record<string, (params: never) => void>,
>(prefix: string) {
  function useExternalEvents(events: EventHandlers) {
    const eventHandlers = Object.entries(events).reduce<Record<string, EventHandler>>(
      (acc, [key, handler]) => {
        const eventName = `${prefix}:${key}`;
        return { ...acc, [eventName]: (payload?: unknown) => (handler as EventHandler)(payload) };
      },
      {},
    );

    useIsomorphicLayoutEffect(() => {
      Object.entries(eventHandlers).forEach(([name, handler]) => {
        emitter.off(name, handler);
        emitter.on(name, handler);
      });
      return () => {
        Object.entries(eventHandlers).forEach(([name, handler]) => {
          emitter.off(name, handler);
        });
      };
    }, [eventHandlers]);
  }

  function createEvent<EventKey extends keyof EventHandlers>(event: EventKey) {
    return (...payload: Parameters<EventHandlers[EventKey]>) => {
      emitter.emit(`${prefix}:${String(event)}`, payload[0]);
    };
  }

  return [useExternalEvents, createEvent] as const;
}
