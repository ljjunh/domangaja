import type { AudioGuide, PlayableAudioGuide } from '@/domains/audioGuide/types/api';

interface SpotIdentity {
  title: string;
  latitude: number;
  longitude: number;
}

const EARTH_RADIUS_METERS = 6_371_000;

function normalizeTitle(title: string): string {
  return title
    .normalize('NFC')
    .replace(/\s+/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '')
    .toLowerCase();
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function getDistanceMeters(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
): number {
  const latitudeDelta = toRadians(latitudeB - latitudeA);
  const longitudeDelta = toRadians(longitudeB - longitudeA);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(latitudeA)) *
      Math.cos(toRadians(latitudeB)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function hasAudioUrl(guide: AudioGuide): guide is PlayableAudioGuide {
  return typeof guide.audioUrl === 'string' && guide.audioUrl.trim().length > 0;
}

export function matchAudioGuides(
  spot: SpotIdentity,
  guides: AudioGuide[],
): PlayableAudioGuide[] {
  const normalizedSpotTitle = normalizeTitle(spot.title);

  return guides
    .filter(hasAudioUrl)
    .map(guide => {
      const normalizedGuideTitle = normalizeTitle(guide.title ?? '');

      return {
        guide,
        distance: getDistanceMeters(
          spot.latitude,
          spot.longitude,
          guide.latitude,
          guide.longitude,
        ),
        // 관광지명과 오디오 제목이 완전히 같지 않은 경우도 있어 서로 포함되는지 확인한다.
        hasRelatedTitle:
          normalizedSpotTitle.length > 0 &&
          normalizedGuideTitle.length > 0 &&
          (normalizedGuideTitle.includes(normalizedSpotTitle) ||
            normalizedSpotTitle.includes(normalizedGuideTitle)),
      };
    })
    // 조회 반경은 API 요청에서 제한하므로 여기서는 연관된 제목만 선별한다.
    .filter(candidate => candidate.hasRelatedTitle)
    .sort((a, b) => a.distance - b.distance)
    .map(candidate => candidate.guide);
}
