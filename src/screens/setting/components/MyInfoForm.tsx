import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, TextInput } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { Button } from '@/shared/components/ui';
import { isValidNickname } from '@/domains/user/utils/validateNickname';
import { ProfileImagePicker } from '@/domains/user/components';
import type { GetMeResponse } from '@/domains/user/types/api';

interface MyInfoFormProps {
  me: GetMeResponse;
}

export default function MyInfoForm({ me }: MyInfoFormProps) {
  const { t } = useTranslation();
  const [nickname, setNickname] = useState(me.nickname);
  const [imageUri, setImageUri] = useState<string | null>(me.profileImageUrl);

  const isDirty = nickname !== me.nickname || imageUri !== me.profileImageUrl;
  const canSubmit = isDirty && isValidNickname(nickname);

  return (
    <>
      <ProfileImagePicker imageUri={imageUri} onChange={setImageUri} />
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
          onPress={() => console.log('TODO: 프로필 저장')}
        >
          {t('myInfo.submit')}
        </Button>
        <Text typography="t7" weight="semiBold" color={colors.grey[500]}>
          {t('nickname.rule')}
        </Text>
      </View>
    </>
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
