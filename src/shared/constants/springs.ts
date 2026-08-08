// 프레스 피드백 등 마이크로 인터랙션용 스프링 프리셋
export const SPRING = {
  quick: { stiffness: 800, damping: 55, mass: 1 },
  rapid: { stiffness: 1000, damping: 55, mass: 1 },
} as const;
