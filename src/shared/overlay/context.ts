import { createContext, useContext } from 'react';
import type { OverlayState } from './types';

// Provider 없이 사용하면 throw하는 안전한 컨텍스트
const NULL = Symbol('Null');

function createSafeContext<ContextValue>(displayName?: string) {
  const Context = createContext<ContextValue | typeof NULL>(NULL);
  Context.displayName = displayName ?? 'SafeContext';

  function useSafeContext() {
    const value = useContext(Context);
    if (value === NULL) {
      const error = new Error(`[${Context.displayName}]: Provider not found.`);
      error.name = '[Error] Context';
      throw error;
    }
    return value;
  }

  return [Context.Provider, useSafeContext] as const;
}

export function createOverlayContext() {
  const [OverlayContextProvider, useOverlayContext] = createSafeContext<OverlayState>(
    'overlay-kit/OverlayContext',
  );

  const useCurrentOverlay = () => useOverlayContext().current;
  const useOverlayData = () => useOverlayContext().overlayData;

  return { OverlayContextProvider, useCurrentOverlay, useOverlayData };
}
