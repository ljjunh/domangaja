import type { OverlayData, OverlayItem, OverlayState } from './types';

export type OverlayReducerAction =
  | { type: 'ADD'; overlay: OverlayItem }
  | { type: 'OPEN'; overlayId: string }
  | { type: 'CLOSE'; overlayId: string }
  | { type: 'REMOVE'; overlayId: string }
  | { type: 'CLOSE_ALL' }
  | { type: 'REMOVE_ALL' };

// 닫기/제거 후 'current'(활성 오버레이)가 될 id 계산
// - 닫은 게 최상단이면 그 아래 것, 아니면 열려있는 것 중 가장 위
function getNextCurrentId(
  orderList: string[],
  data: OverlayData,
  targetId: string,
): string | null {
  const openedList = orderList.filter(id => data[id].isOpen === true);
  const targetIndex = openedList.findIndex(id => id === targetId);

  return targetIndex === openedList.length - 1
    ? (openedList[targetIndex - 1] ?? null)
    : (openedList[openedList.length - 1] ?? null);
}

export function overlayReducer(state: OverlayState, action: OverlayReducerAction): OverlayState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.overlayData[action.overlay.id];

      // 같은 id로 닫혀있던 오버레이를 다시 여는 경우 → 다시 열기
      if (existing != null && existing.isOpen === false) {
        return {
          ...state,
          current: action.overlay.id,
          overlayData: {
            ...state.overlayData,
            [action.overlay.id]: { ...existing, isOpen: true },
          },
        };
      }

      const isAlreadyInList = state.overlayOrderList.includes(action.overlay.id);
      if (isAlreadyInList && state.overlayData[action.overlay.id]?.isOpen === true) {
        throw new Error(
          `You can't open the multiple overlays with the same overlayId(${action.overlay.id}). Please set a different id.`,
        );
      }

      return {
        current: action.overlay.id,
        overlayOrderList: [
          ...state.overlayOrderList.filter(id => id !== action.overlay.id),
          action.overlay.id,
        ],
        overlayData: isAlreadyInList
          ? state.overlayData
          : { ...state.overlayData, [action.overlay.id]: action.overlay },
      };
    }

    case 'OPEN': {
      const target = state.overlayData[action.overlayId];
      if (target == null || target.isOpen) {
        return state;
      }
      return {
        ...state,
        overlayData: {
          ...state.overlayData,
          [action.overlayId]: { ...target, isOpen: true, isMounted: true },
        },
      };
    }

    case 'CLOSE': {
      const target = state.overlayData[action.overlayId];
      if (target == null || !target.isOpen) {
        return state;
      }
      const current = getNextCurrentId(state.overlayOrderList, state.overlayData, action.overlayId);
      return {
        ...state,
        current,
        overlayData: {
          ...state.overlayData,
          [action.overlayId]: { ...target, isOpen: false },
        },
      };
    }

    case 'REMOVE': {
      if (state.overlayData[action.overlayId] == null) {
        return state;
      }
      const overlayOrderList = state.overlayOrderList.filter(id => id !== action.overlayId);
      // 이미 없으면 변화 없음
      if (state.overlayOrderList.length === overlayOrderList.length) {
        return state;
      }
      const current = getNextCurrentId(
        state.overlayOrderList,
        state.overlayData,
        action.overlayId,
      );
      const overlayData = { ...state.overlayData };
      delete overlayData[action.overlayId];

      return { current, overlayOrderList, overlayData };
    }

    case 'CLOSE_ALL': {
      if (Object.keys(state.overlayData).length === 0) {
        return state;
      }
      return {
        ...state,
        current: null,
        overlayData: Object.keys(state.overlayData).reduce<OverlayData>(
          (acc, id) => ({ ...acc, [id]: { ...state.overlayData[id], isOpen: false } }),
          {},
        ),
      };
    }

    case 'REMOVE_ALL': {
      return { current: null, overlayOrderList: [], overlayData: {} };
    }
  }
}
