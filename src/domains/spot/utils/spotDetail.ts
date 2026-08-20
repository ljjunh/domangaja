import { toImageUrl } from '@/shared/api/service';
import type { GetSpotDetailResponse } from '@/domains/spot/types/api';
import { getSpotContentTypeLabelKey } from '@/domains/spot/constants/contentType';

function sanitizeHtmlToText(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim();
}

function getHomepageUrl(value: string): string | null {
  const href = value.match(/href=["']([^"']+)["']/i)?.[1];
  const candidate = sanitizeHtmlToText(href ?? value);
  if (!candidate) return null;

  return /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
}

export function toSpotDetailViewData(spot: GetSpotDetailResponse) {
  return {
    ...spot,
    imageUrl: toImageUrl(spot.imageUrl?.trim() || spot.thumbnailUrl?.trim() || null),
    overview: sanitizeHtmlToText(spot.overview ?? '') || null,
    homepageUrl: getHomepageUrl(spot.homepage ?? ''),
    tel: spot.tel?.trim() || null,
    address: spot.address?.trim() || null,
    zipcode: spot.zipcode?.trim() || null,
    contentTypeLabelKey: getSpotContentTypeLabelKey(spot.contentTypeId),
  };
}
