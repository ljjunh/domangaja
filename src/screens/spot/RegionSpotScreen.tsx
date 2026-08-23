import { Suspense, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable as RNPressable,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { ChevronDownIcon, SearchIcon } from '@/assets/icons/common';
import { placeholderImage } from '@/assets/images';
import { spotQueries } from '@/domains/spot/api/queries';
import { getLocalizedRegionName, TOURISM_REGIONS } from '@/domains/spot/constants/tourismRegions';
import type { AreaSpot, GetAreaSpotsParams } from '@/domains/spot/types/api';
import { Image, Pressable, Text } from '@/shared/components/base';
import { Layout, StackHeader } from '@/shared/components/layout';
import { Button, EmptyState } from '@/shared/components/ui';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { toServerLocale } from '@/shared/i18n/serverLocale';
import { formatQuietness } from '@/shared/utils/formatQuietness';
import { RegionSpotSkeleton } from './components';

interface PickerOption {
  code: string;
  name: string;
}

interface PickerProps {
  label: string;
  value: string | null;
  options: PickerOption[];
  disabled?: boolean;
  onSelect: (code: string) => void;
}

function RegionPicker({ label, value, options, disabled = false, onSelect }: PickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedName = options.find(option => option.code === value)?.name;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => setIsOpen(true)}
        style={[styles.picker, disabled && styles.disabledPicker]}
      >
        <Text
          typography="t7"
          weight="medium"
          color={selectedName ? colors.grey[900] : colors.grey[600]}
          numberOfLines={1}
        >
          {selectedName ?? label}
        </Text>
        <ChevronDownIcon width={18} height={18} color={colors.blue[500]} />
      </Pressable>

      <Modal
        transparent
        visible={isOpen}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalRoot}>
          <RNPressable style={StyleSheet.absoluteFill} onPress={() => setIsOpen(false)} />
          <View style={styles.optionCard}>
            <Text typography="t5" weight="bold">
              {label}
            </Text>
            <FlatList
              data={options}
              keyExtractor={option => option.code}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = item.code === value;
                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item.code);
                      setIsOpen(false);
                    }}
                    style={styles.option}
                  >
                    <Text
                      typography="t7"
                      weight={isSelected ? 'bold' : 'medium'}
                      color={isSelected ? colors.blue[500] : colors.grey[800]}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

function RegionSpotItem({ spot, onPress }: { spot: AreaSpot; onPress: () => void }) {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={styles.spotItem}>
      <Image
        source={spot.imageUrl ? { uri: spot.imageUrl } : placeholderImage}
        style={styles.image}
      />
      <View style={styles.spotInfo}>
        <Text typography="t7" weight="bold" numberOfLines={1}>
          {spot.title}
        </Text>
        <Text typography="st13" weight="semiBold" color={colors.grey[500]} numberOfLines={2}>
          {spot.address}
          {spot.quietnessScore != null &&
            ` · ${t('spot.regionSearch.quietness', {
              score: formatQuietness(spot.quietnessScore),
            })}`}
        </Text>
      </View>
    </Pressable>
  );
}

interface RegionSpotResultsProps {
  search: GetAreaSpotsParams;
}

function RegionSpotResults({ search }: RegionSpotResultsProps) {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const query = useSuspenseInfiniteQuery(spotQueries.getAreaSpotsInfinite(search));
  const spots = query.data.pages.flat();

  if (spots.length === 0) {
    return (
      <View style={styles.stateWrap}>
        <EmptyState
          icon={SearchIcon}
          title={t('spot.regionSearch.empty.title')}
          description={t('spot.regionSearch.empty.description')}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={spots}
      keyExtractor={spot => spot.contentId}
      contentContainerStyle={styles.list}
      onEndReached={() => {
        if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        query.isFetchingNextPage ? (
          <ActivityIndicator style={styles.footer} color={colors.grey[400]} />
        ) : null
      }
      renderItem={({ item }) => (
        <RegionSpotItem
          spot={item}
          onPress={() => navigate('SpotDetail', { contentId: item.contentId })}
        />
      )}
    />
  );
}

export default function RegionSpotScreen() {
  const { t, i18n } = useTranslation();
  const [areaCode, setAreaCode] = useState<string | null>(null);
  const [sigunguCode, setSigunguCode] = useState<string | null>(null);
  const [submittedSearch, setSubmittedSearch] = useState<GetAreaSpotsParams | null>(null);
  const language = i18n.resolvedLanguage ?? i18n.language;
  const regionOptions = useMemo(
    () =>
      TOURISM_REGIONS.map(region => ({
        code: region.code,
        name: getLocalizedRegionName(region.code, region.name, language),
      })),
    [language],
  );
  const selectedRegion = TOURISM_REGIONS.find(region => region.code === areaCode);
  const districtOptions = useMemo(
    () =>
      selectedRegion?.districts.map(([code, name]) => ({
        code,
        name: getLocalizedRegionName(code, name, language),
      })) ?? [],
    [language, selectedRegion],
  );

  const submitSearch = () => {
    if (areaCode == null) return;
    setSubmittedSearch({
      areaCode,
      sigunguCode: sigunguCode ?? undefined,
      lang: toServerLocale(i18n.language),
    });
  };

  return (
    <Layout>
      <StackHeader title={t('spot.regionSearch.title')} />
      <View style={styles.filters}>
        <View style={styles.pickerWrap}>
          <RegionPicker
            label={t('spot.regionSearch.areaPlaceholder')}
            value={areaCode}
            options={regionOptions}
            onSelect={code => {
              setAreaCode(code);
              setSigunguCode(null);
            }}
          />
        </View>
        <View style={styles.pickerWrap}>
          <RegionPicker
            label={t('spot.regionSearch.districtPlaceholder')}
            value={sigunguCode}
            options={districtOptions}
            disabled={areaCode == null}
            onSelect={setSigunguCode}
          />
        </View>
        <Button
          size="medium"
          disabled={areaCode == null}
          onPress={submitSearch}
          containerStyle={styles.searchButton}
        >
          {t('spot.regionSearch.search')}
        </Button>
      </View>

      <Suspense
        fallback={
          <View style={styles.skeletonWrap}>
            <RegionSpotSkeleton />
          </View>
        }
      >
        {submittedSearch == null ? (
          <View style={styles.stateWrap}>
            <EmptyState
              icon={SearchIcon}
              title={t('spot.regionSearch.guide.title')}
              description={t('spot.regionSearch.guide.description')}
            />
          </View>
        ) : (
          <RegionSpotResults search={submittedSearch} />
        )}
      </Suspense>
    </Layout>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingVertical: 10,
  },
  pickerWrap: { flex: 1 },
  picker: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.blue[200],
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  disabledPicker: { backgroundColor: colors.grey[50], opacity: 0.6 },
  searchButton: { minWidth: 64, minHeight: 48 },
  stateWrap: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 10,
    gap: 12,
  },
  skeletonWrap: { paddingHorizontal: SCREEN_PADDING_HORIZONTAL },
  list: { paddingHorizontal: SCREEN_PADDING_HORIZONTAL, gap: 10 },
  spotItem: { flexDirection: 'row', gap: 12 },
  image: { width: 70, height: 70, borderRadius: 12 },
  spotInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  footer: { paddingVertical: 20 },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.greyOpacity[500],
  },
  optionCard: {
    height: '70%',
    gap: 12,
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  option: {
    minHeight: 44,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
});
