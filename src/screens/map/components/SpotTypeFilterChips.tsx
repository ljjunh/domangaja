import { type ComponentType } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { type SvgProps } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { SCREEN_PADDING_HORIZONTAL } from '@/shared/constants/layout';
import {
  getSpotContentTypeLabelKey,
  type SpotContentTypeId,
} from '@/domains/spot/constants/contentType';
import {
  CultureIcon,
  EventIcon,
  FoodIcon,
  LeisureIcon,
  ShoppingIcon,
  StayIcon,
  TouristSpotIcon,
} from '@/assets/icons/common';

const ICON_SIZE = 16;

// 어떤 종류를 어떤 순서로 노출할지는 지도 화면의 진열 결정이다
const FILTER_ITEMS: { id: SpotContentTypeId; icon: ComponentType<SvgProps> }[] = [
  { id: '12', icon: TouristSpotIcon },
  { id: '14', icon: CultureIcon },
  { id: '39', icon: FoodIcon },
  { id: '32', icon: StayIcon },
  { id: '38', icon: ShoppingIcon },
  { id: '15', icon: EventIcon },
  { id: '28', icon: LeisureIcon },
];

interface SpotTypeFilterChipsProps {
  selectedContentTypeId: SpotContentTypeId;
  onSelectContentType: (contentTypeId: SpotContentTypeId) => void;
}

export default function SpotTypeFilterChips({
  selectedContentTypeId,
  onSelectContentType,
}: SpotTypeFilterChipsProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    >
      {FILTER_ITEMS.map(({ id, icon: Icon }) => {
        const isSelected = id === selectedContentTypeId;
        // 선택 표시는 색 반전 — 미선택 흰 배경/검은 글씨, 선택 검은 배경/흰 글씨
        const inkColor = isSelected ? colors.white : colors.black;

        return (
          <Pressable
            key={id}
            onPress={() => onSelectContentType(id)}
            style={[styles.chip, isSelected && styles.selectedChip]}
          >
            <Icon width={ICON_SIZE} height={ICON_SIZE} />
            <Text typography="t7" weight="semiBold" color={inkColor}>
              {t(getSpotContentTypeLabelKey(id))}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.white,
    boxShadow: '0 4 4 0 rgba(0, 0, 0, 0.1)',
  },
  selectedChip: {
    backgroundColor: colors.black,
  },
});
