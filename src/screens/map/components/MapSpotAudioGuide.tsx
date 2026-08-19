import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { audioGuideQueries } from '@/domains/audioGuide/api/queries';
import { SpotAudioGuide } from '@/domains/audioGuide/components';
import { matchAudioGuides } from '@/domains/audioGuide/utils/matchAudioGuide';
import type { MapSpot } from '@/domains/spot/types/api';

const SEARCH_RADIUS_METERS = 500;

/**
 * spot과 audioGuide 두 도메인을 엮는 조각이라 도메인이 아니라 화면 쪽에 둔다
 * (도메인끼리는 서로를 import하지 않는다)
 */
interface MapSpotAudioGuideProps {
  spot: MapSpot;
}

export default function MapSpotAudioGuide({ spot }: MapSpotAudioGuideProps) {
  const { i18n } = useTranslation();
  const { data: audioGuides = [] } = useQuery(
    audioGuideQueries.getNearby({
      lat: spot.latitude,
      lng: spot.longitude,
      radius: SEARCH_RADIUS_METERS,
      langCode: i18n.language,
    }),
  );

  const matchedAudioGuides = matchAudioGuides(spot, audioGuides);
  if (matchedAudioGuides.length === 0) {
    return null;
  }

  return <SpotAudioGuide guides={matchedAudioGuides} />;
}
