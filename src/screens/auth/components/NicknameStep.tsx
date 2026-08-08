import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { TextInput } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import TypingTitle from './TypingTitle';
import StepNextButton from './StepNextButton';
import { stepEntering } from '../utils/stepEntering';

interface NicknameStepProps {
  onNext: (nickname: string) => void;
}

export default function NicknameStep({ onNext }: NicknameStepProps) {
  const [isTitleDone, setIsTitleDone] = useState(false);
  const [nickname, setNickname] = useState('');
  const isNicknameEmpty = nickname.trim().length === 0;

  return (
    <View style={styles.container}>
      {/* TODO: 다국어 처리 예정 */}
      <TypingTitle text={'뭐라고\n불러드릴까요?'} onComplete={() => setIsTitleDone(true)} />

      {isTitleDone && (
        <>
          <Animated.View entering={stepEntering()}>
            <TextInput
              typography="t6"
              weight="semiBold"
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임"
              autoFocus
              style={styles.input}
            />
            {/* <View style={styles.sticker}>
              <EmojiSticker emoji="👋" />
            </View> */}
          </Animated.View>
          <Animated.View entering={stepEntering(200)} style={styles.nextButtonArea}>
            <StepNextButton disabled={isNicknameEmpty} onPress={() => onNext(nickname)} />
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
  },
  // sticker: {
  //   position: 'absolute',
  //   top: -35,
  //   right: -10,
  // },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: colors.grey[100],
  },
  nextButtonArea: {
    marginTop: 'auto',
  },
});
