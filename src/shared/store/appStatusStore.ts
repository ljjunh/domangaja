import { create } from 'zustand';

interface AppStatusState {
  /** 서버 점검 중 — 시작 시 /app/config, 사용 중 503 응답 두 경로로 켜짐 */
  isUnderMaintenance: boolean;
  /** 점검 종료 예정 시각 (ISO). 모르면 null */
  maintenanceUntil: string | null;
  /** 현재 버전이 최소 지원 버전 미만 */
  isUpdateRequired: boolean;

  enterMaintenance: (until?: string | null) => void;
  leaveMaintenance: () => void;
  setUpdateRequired: (isRequired: boolean) => void;
}

export const useAppStatusStore = create<AppStatusState>(set => ({
  isUnderMaintenance: false,
  maintenanceUntil: null,
  isUpdateRequired: false,

  enterMaintenance: (until = null) => set({ isUnderMaintenance: true, maintenanceUntil: until }),
  leaveMaintenance: () => set({ isUnderMaintenance: false, maintenanceUntil: null }),
  setUpdateRequired: isRequired => set({ isUpdateRequired: isRequired }),
}));
