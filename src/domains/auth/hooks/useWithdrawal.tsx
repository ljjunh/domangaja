import { useMutation } from '@tanstack/react-query';
import { overlay } from '@/shared/overlay';
import { useAuthStore } from '@/shared/store/authStore';
import { tokenStorage } from '@/shared/api/tokenStorage';
import { WithdrawalSheet } from '@/domains/auth/components';
import { authMutations } from '@/domains/auth/api/queries';

export const useWithdrawal = () => {
  const logout = useAuthStore(state => state.logout);
  const { mutate: withdrawAccount } = useMutation(authMutations.withdraw());

  const confirmWithdrawal = () => {
    overlay.open(({ unmount }) => {
      const handleWithdrawalConfirm = async () => {
        withdrawAccount(undefined, {
          onSuccess: async () => {
            await tokenStorage.clear();
            logout();
          },
        });
      };
      // 시트는 스스로 퇴장 애니메이션을 돌린 뒤 onClose를 부르므로 unmount만 연결
      return <WithdrawalSheet onClose={unmount} onConfirm={handleWithdrawalConfirm} />;
    });
  };

  return { confirmWithdrawal };
};
