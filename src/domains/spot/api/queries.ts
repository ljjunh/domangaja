// 쿼리키 + queryOptions/mutationOptions (TanStack Query 정책)
import { queryOptions } from '@tanstack/react-query';
import { getTodaySpot } from '@/domains/spot/api/service';

const all = ['spot'] as const;

export const spotQueryKeys = {
  all,
  today: [...all, 'today'] as const,
};

export const spotQueries = {
  getTodaySpot: () =>
    queryOptions({
      queryKey: spotQueryKeys.today,
      queryFn: getTodaySpot,
    }),
};
