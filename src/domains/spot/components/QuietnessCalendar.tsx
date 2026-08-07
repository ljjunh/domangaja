import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { IconButton } from '@/shared/components/ui';
import { ArrowLeftIcon, ArrowRightIcon } from '@/assets/icons/common';
import { useTranslation } from 'react-i18next';
import { getQuietnessLevel, QUIETNESS_LEVEL_COLORS, QuietnessLevel } from '../constants/quietness';

// 서버 연동 시 월별 한적도 조회 응답으로 대체
const MOCK_DAILY_QUIETNESS: Record<number, number> = {
  1: 85,
  2: 55,
  3: 20,
  4: 25,
  5: 15,
  6: 80,
  7: 88,
  8: 99,
  9: 50,
  10: 30,
  11: 20,
  12: 25,
  13: 75,
  14: 82,
  15: 90,
  16: 45,
  17: 30,
  // ...31일까지 적당히
};

// 범례 표시 순서
const QUIETNESS_LEVELS: QuietnessLevel[] = ['quiet', 'normal', 'crowded'];

function buildMonthGrid(monthDate: Date): (number | null)[][] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  // 1일의 요일
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  // 마지막 날 = 다음달 1일의 하루 전
  const lastDate = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];

  // 1일이 올바른 요일 칸에 놓이도록 앞을 null로 채움
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(null);
  }

  // 1일부터 말일까지
  for (let day = 1; day <= lastDate; day++) {
    cells.push(day);
  }

  // 항상 6주(42칸)까지 채움 -> 그리드 높이 고정
  while (cells.length < 42) {
    cells.push(null);
  }

  const weeks: (number | null)[][] = [];

  // 7개씩 잘라 주 단위로 2차원 배열로
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// 아무 일요일에서 시작해 7일을 연속으로 포맷하면 요일 이름 배열이 나온다
function getWeekdayLabels(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  // 26.07.05는 일요일(아무 일요일이나 됨
  return Array.from({ length: 7 }, (_, i) => formatter.format(new Date(2026, 6, 5 + i)));
}

function getWeekdayColor(index: number): string {
  if (index === 0) return colors.red[500];
  if (index === 6) return colors.blue[600];
  return colors.grey[500];
}

// 날짜 글자색, 데이ㅓㅌ 없는 날은 회색
function getDayTextColor(day: number): string {
  const quietness = MOCK_DAILY_QUIETNESS[day];
  if (quietness == null) {
    return colors.grey[500];
  }
  return QUIETNESS_LEVEL_COLORS[getQuietnessLevel(quietness)].ink;
}

function findBestDay(dailyQuietness: Record<number, number>) {
  let best: { day: number; score: number } | null = null;
  for (const [day, score] of Object.entries(dailyQuietness)) {
    if (best == null || score > best.score) {
      best = { day: Number(day), score };
    }
  }
  return best;
}

function BestDayBanner({ date, score }: { date: Date; score: number }) {
  const { t, i18n } = useTranslation();

  // "7월 8일 수요일" / "wednesday, July 8" - 어순은 Intl이 로케일별로 처리
  const dateLabel = new Intl.DateTimeFormat(i18n.language, {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);

  return (
    <View style={styles.banner}>
      <View style={styles.bannerDayBadge}>
        <Text typography="t7" weight="semiBold" color={colors.blue[500]}>
          {date.getDate()}
        </Text>
      </View>
      <View style={styles.bannerTexts}>
        <Text typography="t7" weight="bold" color={colors.blue[500]}>
          {t('spotSheet.bestDayTitle', { date: dateLabel })}
        </Text>
        <Text typography="t7" weight="regular" color={colors.grey[700]}>
          {t('spotSheet.bestDaySubtitle', { score })}
        </Text>
      </View>
    </View>
  );
}

export default function QuietnessCalendar() {
  const { t, i18n } = useTranslation();
  // 항상 '그 달의 1일'이 기본값(31일에서 월 이동하면 달을 건너뛰는 이월 버그 방지)
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const weeks = buildMonthGrid(visibleMonth);
  const weekdayLabels = getWeekdayLabels(i18n.language);
  const monthLabel = new Intl.DateTimeFormat(i18n.language, {
    year: 'numeric',
    month: 'long',
  }).format(visibleMonth);

  const moveMonth = (diff: 1 | -1) => {
    setVisibleMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + diff, 1));
  };

  const bestDay = findBestDay(MOCK_DAILY_QUIETNESS);

  return (
    <View style={styles.container}>
      {/* 가장 한적한 날 배너 */}
      {bestDay != null && (
        <BestDayBanner
          date={new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), bestDay.day)}
          score={bestDay.score}
        />
      )}

      {/* 월 조정 */}
      <View style={styles.monthHeader}>
        <IconButton icon={ArrowLeftIcon} onPress={() => moveMonth(-1)} color={colors.black} />
        <Text typography="t5" weight="semiBold">
          {monthLabel}
        </Text>
        <IconButton icon={ArrowRightIcon} onPress={() => moveMonth(1)} color={colors.black} />
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekRow}>
        {weekdayLabels.map((label, index) => (
          <View key={label} style={styles.weekdayCell}>
            <Text typography="st12" weight="semiBold" color={getWeekdayColor(index)}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* 날짜 그리드 */}
      <View>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => (
              <View key={dayIndex} style={styles.dayCell}>
                {day != null && (
                  <Text typography="st12" weight="semiBold" color={getDayTextColor(day)}>
                    {day}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* 범례 */}
      <View style={styles.legend}>
        {QUIETNESS_LEVELS.map(level => (
          <View key={level} style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: QUIETNESS_LEVEL_COLORS[level].ink }]}
            />
            <Text typography="st12" weight="medium">
              {t(`spotSheet.quietnessLevel.${level}`)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 10,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: colors.blue[50],
  },
  bannerDayBadge: {
    backgroundColor: colors.white,
    width: 36,
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTexts: {
    flex: 1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
});
