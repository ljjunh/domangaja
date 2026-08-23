import { Suspense, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SearchIcon } from '@/assets/icons/common';
import { getLocalizedRegionName, TOURISM_REGIONS } from '@/domains/spot/constants/tourismRegions';
import type { GetAreaSpotsParams } from '@/domains/spot/types/api';
import { Layout, StackHeader } from '@/shared/components/layout';
import { Button, EmptyState } from '@/shared/components/ui';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import { toServerLocale } from '@/shared/i18n/serverLocale';
import { RegionPicker, RegionSpotResults, RegionSpotSkeleton } from './components';

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
  searchButton: { minWidth: 64, minHeight: 48 },
  stateWrap: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingTop: 10,
  },
  skeletonWrap: { paddingHorizontal: SCREEN_PADDING_HORIZONTAL },
});
