/**
 * 화면에 표시할 한적도.
 * 서버가 소수점(50.48)을 주는데 마커 원 안에 안 들어가고 "한적도 50.48%"도 읽기 나쁘다.
 * 올림하면 99.6이 100%가 되어 "완전히 한적함"처럼 읽히므로 내림한다.
 */
export function formatQuietness(score: number): number {
  return Math.floor(score);
}
