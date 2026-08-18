import { queryOptions } from '@tanstack/react-query';

import { getNearbyAudioGuides } from '@/domains/audioGuide/api/service';
import type { GetNearbyAudioGuidesRequest } from '@/domains/audioGuide/types/api';

const all = ['audioGuide'] as const;

export const audioGuideQueryKeys = {
  all,
  nearby: (params: GetNearbyAudioGuidesRequest) => [...all, 'nearby', params] as const,
};

export const audioGuideQueries = {
  getNearby: (params: GetNearbyAudioGuidesRequest) =>
    queryOptions({
      queryKey: audioGuideQueryKeys.nearby(params),
      queryFn: () => getNearbyAudioGuides(params),
    }),
};
