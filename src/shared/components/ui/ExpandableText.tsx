import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

const COLLAPSED_LINES = 3;

interface ExpandableTextProps {
  text: string;
}

export default function ExpandableText({ text }: ExpandableTextProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  return (
    <View style={styles.container}>
      {/* numberOfLines가 걸린 Text로는 전체 줄 수를 알 수 없어, 안 보이는 사본으로 측정한다 */}
      <Text
        accessible={false}
        typography="t6"
        style={[styles.description, styles.measureText]}
        onTextLayout={event => {
          const isExpandable = event.nativeEvent.lines.length > COLLAPSED_LINES;
          setCanExpand(current => (current === isExpandable ? current : isExpandable));
        }}
      >
        {text}
      </Text>
      <Text
        typography="t6"
        color={colors.grey[900]}
        style={styles.description}
        numberOfLines={isExpanded ? undefined : COLLAPSED_LINES}
        ellipsizeMode="tail"
      >
        {text}
      </Text>
      {canExpand && (
        <Pressable style={styles.moreButton} onPress={() => setIsExpanded(value => !value)}>
          <Text typography="t7" color={colors.grey[600]}>
            {isExpanded ? t('common.collapse') : t('common.more')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.grey[100],
  },
  description: { lineHeight: 23 },
  measureText: { position: 'absolute', left: 14, right: 14, opacity: 0 },
  moreButton: {
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.grey[200],
  },
});
