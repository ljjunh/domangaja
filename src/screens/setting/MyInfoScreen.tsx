import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, TextInput } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { colors } from '@/shared/constants/colors';
import { Button } from '@/shared/components/ui';
import { isValidNickname } from '@/domains/user/utils/validateNickname';
import { ProfileImagePicker } from '@/domains/user/components';

// TODO: 갤러리 권한 거부 시 시스템권한으로 이동하는 바텀시트
// TODO: 서버 연동 시 user 쿼리로 교체, 훅 분리

const MOCK_MY_INFO = {
  nickname: '날갯짓너만을0031',
  imageUri: null as string | null,
};

export default function MyInfoScreen() {
  const { t } = useTranslation();
  const [nickname, setNickname] = useState(MOCK_MY_INFO.nickname);
  const [imageUri, setImageUri] = useState<string | null>(MOCK_MY_INFO.imageUri);

  const isDirty = nickname !== MOCK_MY_INFO.nickname || imageUri !== MOCK_MY_INFO.imageUri;
  const canSubmit = isDirty && isValidNickname(nickname);

  return (
    <Layout>
      <StackHeader title={t('myInfo.title')} />
      <View style={styles.container}>
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
            {t('myInfo.nicknameRule')}
          </Text>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL + 15,
    paddingTop: 50,
    gap: 15,
  },
  nicknameInput: {
    borderBottomWidth: 1.5,
    paddingVertical: 10,
  },
  buttonGap: {
    gap: 5,
  },
});
