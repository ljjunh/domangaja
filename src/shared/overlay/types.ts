import type { FC } from 'react';

export type OverlayControllerProps = {
  overlayId: string;
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
};

export type OverlayAsyncControllerProps<T> = Omit<OverlayControllerProps, 'close'> & {
  close: (param: T) => void;
  reject: (reason?: unknown) => void;
};

export type OverlayControllerComponent = FC<OverlayControllerProps>;
export type OverlayAsyncControllerComponent<T> = FC<OverlayAsyncControllerProps<T>>;

export type OverlayItem = {
  id: string;
  componentKey: string;
  isOpen: boolean;
  isMounted: boolean;
  controller: OverlayControllerComponent;
};

export type OverlayData = Record<string, OverlayItem>;

export type OverlayState = {
  // 현재 활성(최상단) 오버레이 id
  current: string | null;
  // 쌓인 순서대로의 오버레이 id 목록
  overlayOrderList: string[];
  // id → 오버레이 정보
  overlayData: OverlayData;
};
