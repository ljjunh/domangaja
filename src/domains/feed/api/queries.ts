import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import {
  bookmarkFeed,
  createComment,
  createFeed,
  createStory,
  deleteComment,
  deleteFeed,
  deleteStory,
  getComments,
  getFeed,
  getFeeds,
  getStories,
  getStory,
  likeComment,
  likeStory,
  reportComment,
  reportFeed,
  reportStory,
  unbookmarkFeed,
  unlikeComment,
  unlikeStory,
} from '@/domains/feed/api/service';
import type {
  Comment,
  Feed,
  GetFeedsResponse,
  GetStoriesResponse,
  Story,
} from '@/domains/feed/types/api';

const STORY_PAGE_SIZE = 10;
const FEED_PAGE_SIZE = 20;

const all = ['feed'] as const;

export const feedQueryKeys = {
  all,
  storyList: [...all, 'storyList'] as const,
  storyDetail: (storyId: number) => [...all, 'storyDetail', storyId] as const,
  feedList: [...all, 'feedList'] as const,
  feedDetail: (feedId: number) => [...all, 'feedDetail', feedId] as const,
  comments: (feedId: number) => [...all, 'comments', feedId] as const,
};

export const feedQueries = {
  storyList: () =>
    infiniteQueryOptions({
      queryKey: feedQueryKeys.storyList,
      queryFn: ({ pageParam }) => getStories({ page: pageParam, size: STORY_PAGE_SIZE }),
      initialPageParam: 0,
      getNextPageParam: lastPage => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    }),

  storyDetail: (storyId: number) =>
    queryOptions({
      queryKey: feedQueryKeys.storyDetail(storyId),
      queryFn: () => getStory(storyId),
    }),

  feedList: () =>
    infiniteQueryOptions({
      queryKey: feedQueryKeys.feedList,
      queryFn: ({ pageParam }) => getFeeds({ page: pageParam, size: FEED_PAGE_SIZE }),
      initialPageParam: 0,
      getNextPageParam: lastPage => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    }),

  feedDetail: (feedId: number) =>
    queryOptions({
      queryKey: feedQueryKeys.feedDetail(feedId),
      queryFn: () => getFeed(feedId),
    }),

  comments: (feedId: number) =>
    queryOptions({
      queryKey: feedQueryKeys.comments(feedId),
      queryFn: () => getComments(feedId),
    }),
};

function applyLikeResult(storyId: number, result: { active: boolean; count: number }) {
  const patch = (story: Story): Story =>
    story.id === storyId ? { ...story, likedByMe: result.active, likeCount: result.count } : story;

  queryClient.setQueryData<Story>(feedQueryKeys.storyDetail(storyId), prev =>
    prev == null ? prev : patch(prev),
  );

  queryClient.setQueryData<InfiniteData<GetStoriesResponse>>(feedQueryKeys.storyList, prev =>
    prev == null
      ? prev
      : {
          ...prev,
          pages: prev.pages.map(page => ({ ...page, content: page.content.map(patch) })),
        },
  );
}

// 삭제·신고 — 캐시 정리
function removeStoryFromCaches(storyId: number) {
  queryClient.invalidateQueries({ queryKey: feedQueryKeys.storyList });
  queryClient.removeQueries({ queryKey: feedQueryKeys.storyDetail(storyId) });
}

function removeFeedFromCaches(feedId: number) {
  queryClient.invalidateQueries({ queryKey: feedQueryKeys.feedList });
  queryClient.removeQueries({ queryKey: feedQueryKeys.feedDetail(feedId) });
}

// 북마크도 좋아요와 동일하게 상세 화면·목록 어느 쪽에서 눌러도 두 캐시가 같이 맞아야 한다
function applyBookmarkResult(feedId: number, result: { active: boolean; count: number }) {
  const patch = (feed: Feed): Feed =>
    feed.id === feedId
      ? { ...feed, bookmarkedByMe: result.active, bookmarkCount: result.count }
      : feed;

  queryClient.setQueryData<Feed>(feedQueryKeys.feedDetail(feedId), prev =>
    prev == null ? prev : patch(prev),
  );

  queryClient.setQueryData<InfiniteData<GetFeedsResponse>>(feedQueryKeys.feedList, prev =>
    prev == null
      ? prev
      : {
          ...prev,
          pages: prev.pages.map(page => ({ ...page, content: page.content.map(patch) })),
        },
  );
}

// 댓글 삭제·신고 — 캐시에서 제거 (댓글은 목록 API가 없어 story/feed와 달리 invalidate가 아니라 직접 필터링)
function removeCommentFromCache(feedId: number, commentId: number) {
  queryClient.setQueryData<Comment[]>(feedQueryKeys.comments(feedId), prev =>
    prev == null ? prev : prev.filter(comment => comment.id !== commentId),
  );
}

// 좋아요도 story/feed와 동일한 패턴 — 댓글은 배열 캐시라 find 대신 map으로 해당 항목만 패치
function applyCommentLikeResult(
  feedId: number,
  commentId: number,
  result: { active: boolean; count: number },
) {
  queryClient.setQueryData<Comment[]>(feedQueryKeys.comments(feedId), prev =>
    prev == null
      ? prev
      : prev.map(comment =>
          comment.id === commentId
            ? { ...comment, likedByMe: result.active, likeCount: result.count }
            : comment,
        ),
  );
}

// 댓글 등록/삭제 응답에는 갱신된 feed가 안 들어있어 commentCount를 직접 +1/-1 한다 —
// 좋아요·북마크처럼 서버 값을 그대로 반영할 수 없는 유일한 경우
function adjustFeedCommentCount(feedId: number, delta: number) {
  const patch = (feed: Feed): Feed =>
    feed.id === feedId ? { ...feed, commentCount: feed.commentCount + delta } : feed;

  queryClient.setQueryData<Feed>(feedQueryKeys.feedDetail(feedId), prev =>
    prev == null ? prev : patch(prev),
  );

  queryClient.setQueryData<InfiniteData<GetFeedsResponse>>(feedQueryKeys.feedList, prev =>
    prev == null
      ? prev
      : {
          ...prev,
          pages: prev.pages.map(page => ({ ...page, content: page.content.map(patch) })),
        },
  );
}

// 신고 사유 UI가 생기기 전까지 사용할 고정 사유
const TEMP_REPORT_REASON = '부적절한 콘텐츠';

export const feedMutations = {
  createFeed: () =>
    mutationOptions({
      mutationFn: createFeed,
      // 방금 등록한 피드가 목록에 바로 보이도록 — 상세 화면을 닫고 돌아왔을 때 최신 목록이어야 한다
      onSuccess: () => queryClient.invalidateQueries({ queryKey: feedQueryKeys.feedList }),
    }),

  deleteFeed: () =>
    mutationOptions({
      mutationFn: deleteFeed,
      onSuccess: (_data, feedId) => removeFeedFromCaches(feedId),
    }),

  reportFeed: () =>
    mutationOptions({
      mutationFn: (feedId: number) => reportFeed(feedId, TEMP_REPORT_REASON),
      onSuccess: (_data, feedId) => removeFeedFromCaches(feedId),
    }),

  bookmarkFeed: () =>
    mutationOptions({
      mutationFn: bookmarkFeed,
      onSuccess: (result, feedId) => applyBookmarkResult(feedId, result),
    }),

  unbookmarkFeed: () =>
    mutationOptions({
      mutationFn: unbookmarkFeed,
      onSuccess: (result, feedId) => applyBookmarkResult(feedId, result),
    }),

  createComment: () =>
    mutationOptions({
      mutationFn: ({ feedId, content }: { feedId: number; content: string }) =>
        createComment(feedId, { content }),
      onSuccess: (comment, { feedId }) => {
        // 서버가 최신순으로 내려주므로 새 댓글은 맨 앞에 붙인다
        queryClient.setQueryData<Comment[]>(feedQueryKeys.comments(feedId), prev =>
          prev == null ? [comment] : [comment, ...prev],
        );
        adjustFeedCommentCount(feedId, 1);
      },
    }),

  deleteComment: () =>
    mutationOptions({
      mutationFn: ({ feedId, commentId }: { feedId: number; commentId: number }) =>
        deleteComment(feedId, commentId),
      onSuccess: (_data, { feedId, commentId }) => {
        removeCommentFromCache(feedId, commentId);
        adjustFeedCommentCount(feedId, -1);
      },
    }),

  reportComment: () =>
    mutationOptions({
      mutationFn: ({ commentId }: { feedId: number; commentId: number }) =>
        reportComment(commentId, TEMP_REPORT_REASON),
      onSuccess: (_data, { feedId, commentId }) => removeCommentFromCache(feedId, commentId),
    }),

  likeComment: () =>
    mutationOptions({
      mutationFn: ({ feedId, commentId }: { feedId: number; commentId: number }) =>
        likeComment(feedId, commentId),
      onSuccess: (result, { feedId, commentId }) =>
        applyCommentLikeResult(feedId, commentId, result),
    }),

  unlikeComment: () =>
    mutationOptions({
      mutationFn: ({ feedId, commentId }: { feedId: number; commentId: number }) =>
        unlikeComment(feedId, commentId),
      onSuccess: (result, { feedId, commentId }) =>
        applyCommentLikeResult(feedId, commentId, result),
    }),

  createStory: () =>
    mutationOptions({
      mutationFn: createStory,
      // 방금 등록한 스토리가 목록에 바로 보이도록 — 상세 화면을 닫고 돌아왔을 때 최신 목록이어야 한다
      onSuccess: () => queryClient.invalidateQueries({ queryKey: feedQueryKeys.storyList }),
    }),

  deleteStory: () =>
    mutationOptions({
      mutationFn: deleteStory,
      onSuccess: (_data, storyId) => removeStoryFromCaches(storyId),
    }),

  likeStory: () =>
    mutationOptions({
      mutationFn: likeStory,
      onSuccess: (result, storyId) => applyLikeResult(storyId, result),
    }),

  unlikeStory: () =>
    mutationOptions({
      mutationFn: unlikeStory,
      onSuccess: (result, storyId) => applyLikeResult(storyId, result),
    }),

  reportStory: () =>
    mutationOptions({
      mutationFn: (storyId: number) => reportStory(storyId, TEMP_REPORT_REASON),
      onSuccess: (_data, storyId) => removeStoryFromCaches(storyId),
    }),
};
