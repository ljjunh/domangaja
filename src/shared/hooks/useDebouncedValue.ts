import { useEffect, useState } from 'react';

/**
 * 값이 delayMs 동안 멈춰 있으면 그때 반영한다.
 * 반환값이 인자와 같아졌는지로 "입력이 멎었는지"를 호출부에서 판별할 수 있다
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    function updateAfterDelay() {
      const id = setTimeout(() => setDebouncedValue(value), delayMs);
      return () => clearTimeout(id);
    },
    [value, delayMs],
  );

  return debouncedValue;
}
