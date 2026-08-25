import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import Video, { type VideoRef } from 'react-native-video';

import { PlayFillIcon } from '@/assets/icons/common';
import type { PlayableAudioGuide } from '@/domains/audioGuide/types/api';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

interface SpotAudioGuideProps {
  guides: PlayableAudioGuide[];
}

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  return `${minutes}:${String(safeSeconds % 60).padStart(2, '0')}`;
}

export default function SpotAudioGuide({ guides }: SpotAudioGuideProps) {
  const { t } = useTranslation();
  const playerRef = useRef<VideoRef>(null);
  const isFocused = useIsFocused();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(guides[0]?.playTimeSeconds ?? 0);
  const guide = guides[activeIndex];

  if (!guide) return null;

  const title = guide.title?.trim();
  const audioTitle = guide.audioTitle?.trim();
  const hasMultipleGuides = guides.length > 1;

  const selectGuide = (index: number) => {
    const nextGuide = guides[index];
    if (!nextGuide) return;

    setActiveIndex(index);
    setIsPaused(true);
    setIsBuffering(false);
    setHasError(false);
    setCurrentTime(0);
    setDuration(nextGuide.playTimeSeconds ?? 0);
  };

  return (
    <View style={styles.container}>
      <Video
        key={guide.audioUrl}
        ref={playerRef}
        source={{ uri: guide.audioUrl.trim() }}
        paused={isPaused || !isFocused}
        ignoreSilentSwitch="ignore"
        playInBackground={false}
        playWhenInactive={false}
        progressUpdateInterval={500}
        style={styles.player}
        onLoad={event => {
          playerRef.current?.seek(0);
          setCurrentTime(0);
          setDuration(event.duration || guide.playTimeSeconds || 0);
        }}
        onProgress={event => setCurrentTime(event.currentTime)}
        onBuffer={event => setIsBuffering(event.isBuffering)}
        onEnd={() => {
          playerRef.current?.seek(0);
          setIsPaused(true);
          setCurrentTime(0);
        }}
        onError={() => {
          setHasError(true);
          setIsPaused(true);
          setIsBuffering(false);
        }}
      />

      <View style={styles.mainRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isPaused
              ? t('audioGuide.playAccessibilityLabel')
              : t('audioGuide.pauseAccessibilityLabel')
          }
          disabled={hasError}
          style={[styles.playButton, hasError && styles.disabledButton]}
          onPress={() => setIsPaused(value => !value)}
        >
          {isBuffering ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : isPaused ? (
            <PlayFillIcon width={40} height={40} color={colors.white} />
          ) : (
            <View style={styles.pauseIcon}>
              <View style={styles.pauseBar} />
              <View style={styles.pauseBar} />
            </View>
          )}
        </Pressable>
        <View style={styles.texts}>
          <View style={styles.titleRow}>
            <Text typography="t7" weight="semiBold" style={styles.title}>
              {title || t('audioGuide.title')}
            </Text>
            {audioTitle && audioTitle !== title && (
              <Text typography="st12" color={colors.grey[700]} style={styles.audioTitle}>
                {audioTitle}
              </Text>
            )}
          </View>
          <Text typography="st12" weight="semiBold" color={colors.grey[600]}>
            {hasError
              ? t('audioGuide.error')
              : `${formatTime(currentTime)} / ${formatTime(duration)}`}
          </Text>
        </View>
        {hasMultipleGuides && (
          <Text typography="st12" color={colors.grey[600]}>
            {activeIndex + 1} / {guides.length}
          </Text>
        )}
      </View>

      {hasMultipleGuides && (
        <View style={styles.guideNavigation}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('audioGuide.previousAccessibilityLabel')}
            disabled={activeIndex === 0}
            onPress={() => selectGuide(activeIndex - 1)}
          >
            <Text
              typography="st12"
              weight="semiBold"
              color={activeIndex === 0 ? colors.grey[400] : colors.blue[600]}
            >
              {t('audioGuide.previous')}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('audioGuide.nextAccessibilityLabel')}
            disabled={activeIndex === guides.length - 1}
            onPress={() => selectGuide(activeIndex + 1)}
          >
            <Text
              typography="st12"
              weight="semiBold"
              color={activeIndex === guides.length - 1 ? colors.grey[400] : colors.blue[600]}
            >
              {t('audioGuide.next')}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, borderRadius: 12, backgroundColor: colors.grey[100] },
  player: { position: 'absolute', width: 0, height: 0 },
  mainRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  texts: { flex: 1, gap: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  title: { flexShrink: 1 },
  audioTitle: { flexShrink: 1 },
  playButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.blue[500],
  },
  disabledButton: { backgroundColor: colors.grey[400] },
  pauseIcon: { flexDirection: 'row', gap: 5 },
  pauseBar: { width: 4, height: 18, borderRadius: 2, backgroundColor: colors.white },
  guideNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grey[300],
  },
});
