import { mutationOptions } from '@tanstack/react-query';
import { createStory } from '@/domains/feed/api/service';

export const feedMutations = {
  createStory: () =>
    mutationOptions({
      mutationFn: createStory,
    }),
};
