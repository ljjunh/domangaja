import { memo, useEffect, type Dispatch } from 'react';
import type { OverlayControllerComponent } from './types';
import type { OverlayReducerAction } from './overlayReducer';

type OverlayControllerHostProps = {
  isOpen: boolean;
  overlayId: string;
  controller: OverlayControllerComponent;
  overlayDispatch: Dispatch<OverlayReducerAction>;
};

/**
 * 각 오버레이를 감싸는 호스트
 * - 마운트 직후 다음 프레임에 OPEN 디스패치 → isOpen=false → true 로 바뀌며 등장 애니메이션
 * - controller에 isOpen / close / unmount 를 주입해 렌더
 */
export const OverlayController = memo(function OverlayController({
  isOpen,
  overlayId,
  controller: Controller,
  overlayDispatch,
}: OverlayControllerHostProps) {
  useEffect(() => {
    requestAnimationFrame(() => {
      overlayDispatch({ type: 'OPEN', overlayId });
    });
  }, [overlayDispatch, overlayId]);

  return (
    <Controller
      overlayId={overlayId}
      isOpen={isOpen}
      close={() => overlayDispatch({ type: 'CLOSE', overlayId })}
      unmount={() => overlayDispatch({ type: 'REMOVE', overlayId })}
    />
  );
});
