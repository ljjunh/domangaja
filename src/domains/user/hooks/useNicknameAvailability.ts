import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { userQueries } from '@/domains/user/api/queries';
import { isValidNickname, normalizeNickname } from '@/domains/user/utils/validateNickname';

const DEBOUNCE_MS = 500;

// idle: 확인할 상태가 아님(규칙 위반 또는 입력 중), checking: 조회 중,
// available: 사용 가능, unavailable: 사용 불가, failed: 조회 실패(확인되지 않음)
export type NicknameCheckStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'failed';

/**
 * 닉네임 사용 가능 여부를 디바운스해서 확인
 * 규칙(2~10자, 한글/영어/숫자)을 통과한 값만 서버로 보냄
 * accessToken은 온보딩처럼 tokenStorage에 토큰이 아직 없을 때만 넘김
 */
export const useNicknameAvailability = (nickname: string, accessToken?: string) => {
  const trimmedNickname = normalizeNickname(nickname);
  const debouncedNickname = useDebouncedValue(trimmedNickname, DEBOUNCE_MS);

  const isSettled = debouncedNickname === trimmedNickname;
  const isCheckable = isValidNickname(trimmedNickname);

  const { data, isFetching, isError, error } = useQuery({
    ...userQueries.nicknameAvailability(debouncedNickname, accessToken),
    enabled: isSettled && isCheckable,
  });

  if (isError) {
    console.error('[nicknameAvailability] 조회 실패:', debouncedNickname, error);
  }

  const status = resolveStatus({
    isCheckable,
    isSettled,
    isFetching,
    isError,
    available: data?.available,
  });

  return {
    status,
    reason: status === 'unavailable' ? data?.reason ?? null : null,
  };
};

function resolveStatus({
  isCheckable,
  isSettled,
  isFetching,
  isError,
  available,
}: {
  isCheckable: boolean;
  isSettled: boolean;
  isFetching: boolean;
  isError: boolean;
  available: boolean | undefined;
}): NicknameCheckStatus {
  if (!isCheckable || !isSettled) {
    return 'idle';
  }
  if (isFetching) {
    return 'checking';
  }
  if (isError) {
    return 'failed';
  }
  if (available == null) {
    return 'idle';
  }
  return available ? 'available' : 'unavailable';
}
