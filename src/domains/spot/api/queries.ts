// 쿼리키 + queryOptions/mutationOptions (TanStack Query 정책)
import { mutationOptions, queryOptions } from '@tanstack/react-query';
import {
  getPopularSpots,
  getTodaySpot,
  getWeeklyThemes,
  getRecentSpots,
  getScraps,
  deleteScrap,
  createScrap,
  createSpotView,
} from '@/domains/spot/api/service';
import {
  type GetPopularSpotsRequest,
  type GetWeeklyThemesRequest,
  type GetRecentSpotsRequest,
  type GetScrapsRequest,
  type GetScrapsResponse,
  type DeleteScrapRequest,
} from '@/domains/spot/types/api';
import { queryClient } from '@/shared/api/queryClient';

const all = ['spot'] as const;

export const spotQueryKeys = {
  all,
  today: [...all, 'today'] as const,
  popular: (params: GetPopularSpotsRequest) => [...all, 'popular', params] as const,
  themes: (params: GetWeeklyThemesRequest) => [...all, 'themes', params] as const,
  recent: (params: GetRecentSpotsRequest) => [...all, 'recent', params] as const,
  scrapsAll: [...all, 'scraps'] as const,
  scraps: (params: GetScrapsRequest) => [...all, 'scraps', params] as const,
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

  getRecentSpots: (params: GetRecentSpotsRequest = {}) =>
    queryOptions({
      queryKey: spotQueryKeys.recent(params),
      queryFn: () => getRecentSpots(params),
    }),

  getScraps: (params: GetScrapsRequest) =>
    queryOptions({
      queryKey: spotQueryKeys.scraps(params),
      queryFn: () => getScraps(params),
    }),
};

export const spotMutations = {
  createScrap: () =>
    mutationOptions({
      mutationFn: createScrap,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: spotQueryKeys.scrapsAll });
      },
    }),

  deleteScrap: () =>
    mutationOptions({
      mutationFn: deleteScrap,
      onMutate: async ({ contentId }: DeleteScrapRequest) => {
        await queryClient.cancelQueries({ queryKey: spotQueryKeys.scrapsAll });
        const previous = queryClient.getQueriesData<GetScrapsResponse>({
          queryKey: spotQueryKeys.scrapsAll,
        });
        queryClient.setQueriesData<GetScrapsResponse>({ queryKey: spotQueryKeys.scrapsAll }, prev =>
          prev?.filter(scrap => scrap.contentId !== contentId),
        );
        return { previous };
      },
      onError: (_error, _variables, context) => {
        context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
        queryClient.invalidateQueries({ queryKey: spotQueryKeys.scrapsAll });
      },
    }),

  createSpotView: () =>
    mutationOptions({
      mutationFn: createSpotView,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: spotQueryKeys.all });
      },
    }),
};
