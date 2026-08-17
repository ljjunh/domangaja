import { infiniteQueryOptions, mutationOptions } from '@tanstack/react-query';
import { createStory, getStories } from '@/domains/feed/api/service';

const STORY_PAGE_SIZE = 10;

const all = ['feed'] as const;

export const feedQueryKeys = {
  all,
  storyList: [...all, 'storyList'] as const,
};

export const feedQueries = {
  storyList: () =>
    infiniteQueryOptions({
      queryKey: feedQueryKeys.storyList,
      queryFn: ({ pageParam }) => getStories({ page: pageParam, size: STORY_PAGE_SIZE }),
      initialPageParam: 0,
      getNextPageParam: lastPage => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    }),
};

export const feedMutations = {
  createStory: () =>
    mutationOptions({
      mutationFn: createStory,
    }),
};
