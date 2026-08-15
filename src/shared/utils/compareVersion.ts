/**
 * 현재 버전이 최소 지원 버전보다 낮은지.
 * 문자열 비교로는 "1.10.0" < "1.9.0"이 참이 되므로 점 단위 숫자로 비교한다
 */
export function isVersionBelow(current: string, minimum: string): boolean {
  const currentParts = current.split('.').map(Number);
  const minimumParts = minimum.split('.').map(Number);

  for (let index = 0; index < Math.max(currentParts.length, minimumParts.length); index++) {
    // "1.0"과 "1.0.0"을 같게 취급하려고 없는 자리는 0으로
    const currentPart = currentParts[index] ?? 0;
    const minimumPart = minimumParts[index] ?? 0;

    if (currentPart !== minimumPart) {
      return currentPart < minimumPart;
    }
  }
  return false;
}
