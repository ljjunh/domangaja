import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface ExpandableOverviewProps {
  overview: string;
}

export default function ExpandableOverview({ overview }: ExpandableOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  return (
    <View style={styles.container}>
      <Text
        accessible={false}
        typography="t6"
        style={[styles.description, styles.measureText]}
        onTextLayout={event => {
          const isExpandable = event.nativeEvent.lines.length > 3;
          setCanExpand(current => (current === isExpandable ? current : isExpandable));
        }}
      >
        {overview}
      </Text>
      <Text
        typography="t6"
        color={colors.grey[900]}
        style={styles.description}
        numberOfLines={isExpanded ? undefined : 3}
        ellipsizeMode="tail"
      >
        {overview}
      </Text>
      {canExpand && (
        <Pressable style={styles.moreButton} onPress={() => setIsExpanded(value => !value)}>
          <Text typography="t7" color={colors.grey[600]}>
            {isExpanded ? '접기' : '더보기'}
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
