import { overlay } from '@/shared/overlay';
import { useAuthStore } from '@/shared/store/authStore';
import { tokenStorage } from '@/shared/api/tokenStorage';
import { queryClient } from '@/shared/api/queryClient';
import { userQueryKeys } from '@/domains/user/api/queries';
import { WithdrawalSheet } from '@/domains/auth/components';

export const useWithdrawal = () => {
  const logout = useAuthStore(state => state.logout);

  const confirmWithdrawal = () => {
    overlay.open(({ unmount }) => {
      const handleWithdrawalConfirm = async () => {
        // TODO: 탈퇴 API 연동 (서버 삭제가 성공한 뒤에 아래 세션 정리를 실행해야 한다)
        await tokenStorage.clear();
        queryClient.removeQueries({ queryKey: userQueryKeys.all });
        logout();
      };
      // 시트는 스스로 퇴장 애니메이션을 돌린 뒤 onClose를 부르므로 unmount만 연결
      return <WithdrawalSheet onClose={unmount} onConfirm={handleWithdrawalConfirm} />;
    });
  };

  return { confirmWithdrawal };
};
