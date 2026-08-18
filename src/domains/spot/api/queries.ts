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
  getCongestion,
  deleteScrap,
  createScrap,
  getSpotDetail,
  createSpotView,
} from '@/domains/spot/api/service';
import {
  type GetPopularSpotsRequest,
  type GetWeeklyThemesRequest,
  type GetRecentSpotsRequest,
  type GetScrapsRequest,
  type GetMapSpotsRequest,
  type GetCongestionRequest,
  type GetScrapsResponse,
  type GetSpotDetailRequest,
  type GetSpotDetailResponse,
  type CreateScrapRequest,
  type DeleteScrapRequest,
} from '@/domains/spot/types/api';
import { queryClient } from '@/shared/api/queryClient';

const all = ['spot'] as const;
const RECENT_PAGE_SIZE = 20;

export const spotQueryKeys = {
  all,
  today: [...all, 'today'] as const,
  popularAll: [...all, 'popular'] as const,
  popular: (params: GetPopularSpotsRequest) => [...all, 'popular', params] as const,
  themes: (params: GetWeeklyThemesRequest) => [...all, 'themes', params] as const,
  recentAll: [...all, 'recent'] as const,
  recent: (params: GetRecentSpotsRequest) => [...all, 'recent', params] as const,
  recentInfinite: (limit: number) => [...all, 'recent', 'infinite', limit] as const,
  mapAll: [...all, 'map'] as const,
  map: (params: GetMapSpotsRequest) => [...all, 'map', params] as const,
  congestion: (params: GetCongestionRequest) => [...all, 'congestion', params] as const,
  scrapsAll: [...all, 'scraps'] as const,
  scraps: (params: GetScrapsRequest) => [...all, 'scraps', params] as const,
  detailAll: [...all, 'detail'] as const,
  detail: (params: GetSpotDetailRequest) => [...all, 'detail', params] as const,
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

  getCongestion: (params: GetCongestionRequest) =>
    queryOptions({
      queryKey: spotQueryKeys.congestion(params),
      queryFn: () => getCongestion(params),
    }),

  getScraps: (params: GetScrapsRequest) =>
    queryOptions({
      queryKey: spotQueryKeys.scraps(params),
      queryFn: () => getScraps(params),
    }),

  getSpotDetail: (params: GetSpotDetailRequest) =>
    queryOptions({
      queryKey: spotQueryKeys.detail(params),
      queryFn: () => getSpotDetail(params),
    }),
};

const SCRAPPABLE_LIST_KEYS = [spotQueryKeys.recentAll, spotQueryKeys.popularAll];

interface ScrappableSpot {
  contentId: string;
  scrapped: boolean;
}

type SpotListCache = ScrappableSpot[] | InfiniteData<ScrappableSpot[], number>;

function snapshotSpotLists() {
  return SCRAPPABLE_LIST_KEYS.flatMap(queryKey =>
    queryClient.getQueriesData<SpotListCache>({ queryKey }),
  );
}

async function cancelSpotListQueries() {
  await Promise.all(SCRAPPABLE_LIST_KEYS.map(queryKey => queryClient.cancelQueries({ queryKey })));
}

function snapshotSpotDetails() {
  return queryClient.getQueriesData<GetSpotDetailResponse>({ queryKey: spotQueryKeys.detailAll });
}

function setSpotDetailScrapped(contentId: string, scrapped: boolean, scrapId: number | null) {
  queryClient.setQueriesData<GetSpotDetailResponse>(
    { queryKey: spotQueryKeys.detailAll },
    prev =>
      prev?.contentId === contentId
        ? {
            ...prev,
            scrapped,
            scrapId,
          }
        : prev,
  );
}

function setSpotListScrapped(contentId: string, scrapped: boolean) {
  const patch = (spots: ScrappableSpot[]) =>
    spots.map(spot => (spot.contentId === contentId ? { ...spot, scrapped } : spot));

  SCRAPPABLE_LIST_KEYS.forEach(queryKey => {
    queryClient.setQueriesData<SpotListCache>({ queryKey }, prev => {
      if (prev == null) {
        return prev;
      }
      return Array.isArray(prev) ? patch(prev) : { ...prev, pages: prev.pages.map(patch) };
    });
  });
}

export const spotMutations = {
  createScrap: () =>
    mutationOptions({
      mutationFn: createScrap,
      // 스크랩 목록은 서버가 준 id가 있어야 만들 수 있어서 낙관적으로 못 넣음
      // 목록들의 아이콘만 먼저 뒤집고, 스크랩 목록 자체는 성공 후 무효화
      onMutate: async ({ contentId }: CreateScrapRequest) => {
        await Promise.all([
          cancelSpotListQueries(),
          queryClient.cancelQueries({ queryKey: spotQueryKeys.detailAll }),
        ]);
        const previousLists = snapshotSpotLists();
        const previousDetails = snapshotSpotDetails();
        setSpotListScrapped(contentId, true);
        setSpotDetailScrapped(contentId, true, null);
        return { previousLists, previousDetails };
      },
      onError: (_error, _variables, context) => {
        context?.previousLists.forEach(([key, data]) => queryClient.setQueryData(key, data));
        context?.previousDetails.forEach(([key, data]) => queryClient.setQueryData(key, data));
      },
      onSuccess: (scrap, { contentId }) => {
        setSpotDetailScrapped(contentId, true, scrap.id);
        queryClient.invalidateQueries({ queryKey: spotQueryKeys.scrapsAll });
      },
    }),

  deleteScrap: () =>
    mutationOptions({
      mutationFn: deleteScrap,
      onMutate: async ({ contentId }: DeleteScrapRequest) => {
        await queryClient.cancelQueries({ queryKey: spotQueryKeys.scrapsAll });
        await Promise.all([
          cancelSpotListQueries(),
          queryClient.cancelQueries({ queryKey: spotQueryKeys.detailAll }),
        ]);

        const previousScraps = queryClient.getQueriesData<GetScrapsResponse>({
          queryKey: spotQueryKeys.scrapsAll,
        });
        const previousLists = snapshotSpotLists();
        const previousDetails = snapshotSpotDetails();

        queryClient.setQueriesData<GetScrapsResponse>({ queryKey: spotQueryKeys.scrapsAll }, prev =>
          prev?.filter(scrap => scrap.contentId !== contentId),
        );
        setSpotListScrapped(contentId, false);
        setSpotDetailScrapped(contentId, false, null);

        return { previousScraps, previousLists, previousDetails };
      },
      onError: (_error, _variables, context) => {
        context?.previousScraps.forEach(([key, data]) => queryClient.setQueryData(key, data));
        context?.previousLists.forEach(([key, data]) => queryClient.setQueryData(key, data));
        context?.previousDetails.forEach(([key, data]) => queryClient.setQueryData(key, data));
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
