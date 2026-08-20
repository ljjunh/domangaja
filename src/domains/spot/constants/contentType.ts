// KTO 콘텐츠 종류 — 어떤 id가 있는지는 도메인 지식, 표시 문구는 로케일 파일이 갖는다
export const SPOT_CONTENT_TYPE_IDS = ['12', '14', '15', '28', '32', '38', '39'] as const;

export type SpotContentTypeId = (typeof SPOT_CONTENT_TYPE_IDS)[number];

function isSpotContentTypeId(contentTypeId: string): contentTypeId is SpotContentTypeId {
  return SPOT_CONTENT_TYPE_IDS.includes(contentTypeId as SpotContentTypeId);
}

/**
 * 표시 문구가 아니라 i18n 키를 돌려준다.
 * 순수 함수로 남겨두려면 t를 알 수 없으니, 호출부가 t(key)로 번역한다
 */
export function getSpotContentTypeLabelKey(contentTypeId: string): string {
  return isSpotContentTypeId(contentTypeId)
    ? `spotContentType.${contentTypeId}`
    : 'spotContentType.etc';
}
