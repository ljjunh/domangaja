export const SPOT_CONTENT_TYPE_LABELS = {
  '12': '관광지',
  '14': '문화시설',
  '15': '행사',
  '28': '레포츠',
  '32': '숙박',
  '38': '쇼핑',
  '39': '음식점',
} as const satisfies Record<string, string>;

export type SpotContentTypeId = keyof typeof SPOT_CONTENT_TYPE_LABELS;

export function getSpotContentTypeLabel(contentTypeId: string): string {
  if (contentTypeId in SPOT_CONTENT_TYPE_LABELS) {
    return SPOT_CONTENT_TYPE_LABELS[contentTypeId as SpotContentTypeId];
  }

  return '기타';
}
