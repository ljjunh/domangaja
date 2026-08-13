// 쿼리키 + queryOptions/mutationOptions (TanStack Query 정책)
import { queryOptions } from '@tanstack/react-query';
import { getPopularSpots, getTodaySpot, getWeeklyThemes } from '@/domains/spot/api/service';
import type { GetPopularSpotsRequest, GetWeeklyThemesRequest } from '@/domains/spot/types/api';

const all = ['spot'] as const;

export const spotQueryKeys = {
  all,
  today: [...all, 'today'] as const,
  popular: (params: GetPopularSpotsRequest) => [...all, 'popular', params] as const,
  themes: (params: GetWeeklyThemesRequest) => [...all, 'themes', params] as const,
};

export const spotQueries = {
  getTodaySpot: () =>
    queryOptions({
      queryKey: spotQueryKeys.today,
      queryFn: getTodaySpot,
    }),

  getPopularSpots: (params: GetPopularSpotsRequest = {}) =>
    queryOptions({
      queryKey: spotQueryKeys.popular(params),
      queryFn: () => getPopularSpots(params),
    }),

  getWeeklyThemes: (params: GetWeeklyThemesRequest = {}) =>
    queryOptions({
      queryKey: spotQueryKeys.themes(params),
      queryFn: () => getWeeklyThemes(params),
    }),
};
