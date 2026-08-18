// 쿼리키 + queryOptions/mutationOptions (TanStack Query 정책)
import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import {
  getPopularSpots,
  getTodaySpot,
  getWeeklyThemes,
  getRecentSpots,
  getScraps,
  getMapSpots,
  deleteScrap,
  createScrap,
  createSpotView,
} from '@/domains/spot/api/service';
import {
  type GetPopularSpotsRequest,
  type GetWeeklyThemesRequest,
  type GetRecentSpotsRequest,
  type GetScrapsRequest,
  type GetMapSpotsRequest,
  type GetScrapsResponse,
  type GetRecentSpotsResponse,
  type CreateScrapRequest,
  type DeleteScrapRequest,
} from '@/domains/spot/types/api';
import { queryClient } from '@/shared/api/queryClient';

const all = ['spot'] as const;
const RECENT_PAGE_SIZE = 20;

export const spotQueryKeys = {
  all,
  today: [...all, 'today'] as const,
  popular: (params: GetPopularSpotsRequest) => [...all, 'popular', params] as const,
  themes: (params: GetWeeklyThemesRequest) => [...all, 'themes', params] as const,
  recentAll: [...all, 'recent'] as const,
  recent: (params: GetRecentSpotsRequest) => [...all, 'recent', params] as const,
  recentInfinite: (limit: number) => [...all, 'recent', 'infinite', limit] as const,
  mapAll: [...all, 'map'] as const,
  map: (params: GetMapSpotsRequest) => [...all, 'map', params] as const,
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

  getMapSpots: (params: GetMapSpotsRequest) =>
    queryOptions({
      queryKey: spotQueryKeys.map(params),
      queryFn: () => getMapSpots(params),
    }),

  // 전체 목록 화면용. 홈 섹션(getRecentSpots)과 캐시가 갈리지만 둘 다 recentAll
  // 프리픽스 아래라, 스크랩 낙관적 업데이트가 양쪽을 함께 고친다
  getRecentSpotsInfinite: (limit: number = RECENT_PAGE_SIZE) =>
    infiniteQueryOptions({
      queryKey: spotQueryKeys.recentInfinite(limit),
      queryFn: ({ pageParam }) => getRecentSpots({ limit, page: pageParam }),
      initialPageParam: 0,
      // hasNext가 없는 API — 받은 개수가 limit보다 적으면 마지막 페이지다
      getNextPageParam: (lastPage, _allPages, lastPageParam) =>
        lastPage.length < limit ? undefined : lastPageParam + 1,
    }),

  getScraps: (params: GetScrapsRequest) =>
    queryOptions({
      queryKey: spotQueryKeys.scraps(params),
      queryFn: () => getScraps(params),
    }),
};

// recentAll 아래에는 홈 섹션(배열)과 전체 목록 화면(무한스크롤 = 페이지 배열) 두 모양이
// 섞여 있다. 한쪽 모양만 가정하고 map을 돌리면 다른 쪽에서 터진다
type RecentSpotCache = GetRecentSpotsResponse | InfiniteData<GetRecentSpotsResponse, number>;

// 최근 본 목록은 스크랩 목록과 별개 캐시라, 스크랩 아이콘이 바로 뒤집히려면 여기도 같이 고쳐야 함
function setRecentSpotScrapped(contentId: string, scrapped: boolean) {
  const patch = (spots: GetRecentSpotsResponse) =>
    spots.map(spot => (spot.contentId === contentId ? { ...spot, scrapped } : spot));

  queryClient.setQueriesData<RecentSpotCache>({ queryKey: spotQueryKeys.recentAll }, prev => {
    if (prev == null) {
      return prev;
    }
    return Array.isArray(prev) ? patch(prev) : { ...prev, pages: prev.pages.map(patch) };
  });
}

export const spotMutations = {
  createScrap: () =>
    mutationOptions({
      mutationFn: createScrap,
      // 스크랩 목록은 서버가 준 id가 있어야 만들 수 있어서 낙관적으로 못 넣음
      // 최근 본 목록의 아이콘만 먼저 뒤집고, 목록 자체는 성공 후 무효화
      onMutate: async ({ contentId }: CreateScrapRequest) => {
        await queryClient.cancelQueries({ queryKey: spotQueryKeys.recentAll });
        const previousRecent = queryClient.getQueriesData<RecentSpotCache>({
          queryKey: spotQueryKeys.recentAll,
        });
        setRecentSpotScrapped(contentId, true);
        return { previousRecent };
      },
      onError: (_error, _variables, context) => {
        context?.previousRecent.forEach(([key, data]) => queryClient.setQueryData(key, data));
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: spotQueryKeys.scrapsAll });
      },
    }),

  deleteScrap: () =>
    mutationOptions({
      mutationFn: deleteScrap,
      onMutate: async ({ contentId }: DeleteScrapRequest) => {
        await queryClient.cancelQueries({ queryKey: spotQueryKeys.scrapsAll });
        await queryClient.cancelQueries({ queryKey: spotQueryKeys.recentAll });

        const previous = queryClient.getQueriesData<GetScrapsResponse>({
          queryKey: spotQueryKeys.scrapsAll,
        });
        const previousRecent = queryClient.getQueriesData<RecentSpotCache>({
          queryKey: spotQueryKeys.recentAll,
        });

        queryClient.setQueriesData<GetScrapsResponse>({ queryKey: spotQueryKeys.scrapsAll }, prev =>
          prev?.filter(scrap => scrap.contentId !== contentId),
        );
        setRecentSpotScrapped(contentId, false);

        return { previous, previousRecent };
      },
      onError: (_error, _variables, context) => {
        context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
        context?.previousRecent.forEach(([key, data]) => queryClient.setQueryData(key, data));
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
