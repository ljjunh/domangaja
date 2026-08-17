import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import {
  createStory,
  deleteStory,
  getStories,
  getStory,
  likeStory,
  reportStory,
  unlikeStory,
} from '@/domains/feed/api/service';
import type { GetStoriesResponse, Story } from '@/domains/feed/types/api';

const STORY_PAGE_SIZE = 10;

const all = ['feed'] as const;

export const feedQueryKeys = {
  all,
  storyList: [...all, 'storyList'] as const,
  storyDetail: (storyId: number) => [...all, 'storyDetail', storyId] as const,
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

// 신고 사유 UI가 생기기 전까지 사용할 고정 사유
const TEMP_REPORT_REASON = '부적절한 콘텐츠';

export const feedMutations = {
  createStory: () =>
    mutationOptions({
      mutationFn: createStory,
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
