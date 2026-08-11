import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { Text, TextInput } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { Button } from '@/shared/components/ui';
import { showToast } from '@/shared/lib/toast';
import { isValidNickname, normalizeNickname } from '@/domains/user/utils/validateNickname';
import { useNicknameAvailability } from '@/domains/user/hooks/useNicknameAvailability';
import { userMutations } from '@/domains/user/api/queries';
import { ProfileImagePicker } from '@/domains/user/components';
import { toImageUrl, type UploadFile } from '@/shared/api/service';
import type { GetMeResponse, UpdateProfileRequest } from '@/domains/user/types/api';

interface MyInfoFormProps {
  me: GetMeResponse;
}

export default function MyInfoForm({ me }: MyInfoFormProps) {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const [nickname, setNickname] = useState(me.nickname);
  // 새로 고른 이미지만 담음. null이면 기존 이미지를 그대로 쓴다는 뜻
  const [pickedImage, setPickedImage] = useState<UploadFile | null>(null);

  const { mutate: saveProfile, isPending: isSaving } = useMutation(userMutations.saveProfile());

  const trimmedNickname = normalizeNickname(nickname);
  const isNicknameChanged = trimmedNickname !== me.nickname;

  const { status, reason } = useNicknameAvailability(isNicknameChanged ? nickname : '');

  const isDirty = isNicknameChanged || pickedImage != null;
  const isNicknameReady = !isNicknameChanged || status === 'available';
  const canSubmit = isDirty && isValidNickname(trimmedNickname) && isNicknameReady && !isSaving;

  const handleSubmit = () => {
    const patch: UpdateProfileRequest = isNicknameChanged ? { nickname: trimmedNickname } : {};

    saveProfile(
      { patch, image: pickedImage },
      {
        onSuccess: () => goBack(),
        onError: () => showToast('error', t('myInfo.saveError')),
      },
    );
  };

  return (
    <>
      <ProfileImagePicker
        imageUri={pickedImage?.uri ?? toImageUrl(me.profileImageUrl)}
        onChange={setPickedImage}
      />
      <TextInput
        autoFocus
        typography="t5"
        weight="semiBold"
        value={nickname}
        onChangeText={setNickname}
        textAlign="center"
        style={[
          styles.nicknameInput,
          { borderBottomColor: canSubmit ? colors.blue[500] : colors.grey[300] },
        ]}
      />
      <View style={styles.buttonGap}>
        <Button
          size="medium"
          display="block"
          disabled={!canSubmit}
          loading={isSaving}
          onPress={handleSubmit}
        >
          {t('myInfo.submit')}
        </Button>
        <NicknameHelperText status={status} reason={reason} />
      </View>
    </>
  );
}

function NicknameHelperText({
  status,
  reason,
}: Pick<ReturnType<typeof useNicknameAvailability>, 'status' | 'reason'>) {
  const { t } = useTranslation();

  if (status === 'unavailable') {
    // LENGTH/FORMAT은 클라이언트 검증을 통과했는데 서버가 거절한 경우 = 규칙 불일치
    const key = reason === 'DUPLICATE' ? 'nickname.duplicate' : 'nickname.unavailable';
    return (
      <Text typography="t7" weight="semiBold" color={colors.red[500]}>
        {t(key)}
      </Text>
    );
  }

  if (status === 'failed') {
    return (
      <Text typography="t7" weight="semiBold" color={colors.red[500]}>
        {t('nickname.checkFailed')}
      </Text>
    );
  }

  return (
    <Text typography="t7" weight="semiBold" color={colors.grey[500]}>
      {t('nickname.rule')}
    </Text>
  );
}

const styles = StyleSheet.create({
  nicknameInput: {
    borderBottomWidth: 1.5,
    paddingVertical: 10,
  },
  buttonGap: {
    gap: 5,
  },
});
