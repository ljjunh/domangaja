import { StyleSheet, View } from 'react-native';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { HeartOutlineIcon } from '@/assets/icons/common';

export interface FeedComment {
  id: number;
  nickname: string;
  time: string;
  content: string;
  likeCount: number;
  liked: boolean;
}

interface FeedCommentItemProps {
  comment: FeedComment;
}

export default function FeedCommentItem({ comment }: FeedCommentItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <View style={styles.body}>
        <View style={styles.nicknameRow}>
          <Text typography="st11" weight="bold" color={colors.grey[900]}>
            {comment.nickname}
          </Text>
          <Text typography="st13" weight="semiBold" color={colors.grey[400]}>
            {comment.time}
          </Text>
        </View>
        <Text typography="st10" weight="regular" color={colors.grey[800]}>
          {comment.content}
        </Text>
      </View>
      <Pressable
        hitSlop={8}
        onPress={() => console.log('TODO: 댓글 좋아요 연동')}
        style={styles.like}
      >
        <HeartOutlineIcon width={18} height={18} color={colors.grey[400]} />
        <Text typography="st13" weight="semiBold" color={colors.grey[500]}>
          {comment.likeCount}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.grey[200],
  },
  body: {
    flex: 1,
    gap: 4,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  like: {
    alignItems: 'center',
    gap: 2,
  },
});
