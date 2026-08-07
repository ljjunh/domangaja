// @toss/tds-react-native의 Tab 포팅 (fluid·uncontrolled·redBean 제거판)
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type LayoutRectangle,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';
import { SPRING } from '@/shared/constants/springs';

type TabValue = string;
type TabSize = 'large' | 'small';

interface TabContextValue {
  value?: TabValue;
  onChange?: (value: TabValue) => void;
  size: TabSize;
}

const TabContext = createContext<TabContextValue>({
  value: undefined,
  onChange: () => {},
  size: 'large',
});

interface IndicatorContextValue {
  width: number;
  translateX: number;
  setWidth: (width: number) => void;
  setTranslateX: (translateX: number) => void;
}

const IndicatorContext = createContext<IndicatorContextValue>({
  width: 0,
  translateX: 0,
  setWidth: () => {},
  setTranslateX: () => {},
});

export interface TabProps extends ViewProps {
  /**
   * 탭 높이와 텍스트 크기
   * @default 'large'
   */
  size?: TabSize;
  /**
   * 선택된 탭의 값
   */
  value: TabValue;
  /**
   * 각 탭을 나타내는 Tab.Item들
   */
  children?: ReactNode;
  /**
   * 선택된 탭이 바뀔 때 실행
   */
  onChange: (value: TabValue) => void;
}

export interface TabItemProps {
  /**
   * 탭을 구분하는 값
   */
  value: TabValue;
  /**
   * 탭에 표시될 내용
   */
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const getItemPadding = (size: TabSize) => ({
  top: size === 'large' ? 12 : 8,
  bottom: size === 'large' ? 14 : 8,
  horizontal: 8,
});

function TabItem({ value, children, style }: TabItemProps) {
  const { size, value: selectedValue, onChange } = useContext(TabContext);
  const scale = useRef(new Animated.Value(1)).current;
  const isSelected = value === selectedValue;

  const padding = getItemPadding(size);
  const [layout, setLayout] = useState<LayoutRectangle>();
  const { setWidth, setTranslateX } = useContext(IndicatorContext);

  useEffect(() => {
    if (!isSelected || layout == null) {
      return;
    }
    setTranslateX(layout.x + padding.horizontal);
    setWidth(layout.width - padding.horizontal * 2);
  }, [isSelected, layout, setTranslateX, setWidth, padding.horizontal]);

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected }}
      onPress={() => onChange?.(value)}
      style={[
        itemStyles.container,
        {
          paddingTop: padding.top,
          paddingBottom: padding.bottom,
          paddingHorizontal: padding.horizontal,
        },
        style,
      ]}
      onLayout={event => {
        setLayout(event.nativeEvent.layout);
      }}
      onPressIn={() => {
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, ...SPRING.rapid }).start();
      }}
      onPressOut={() => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, ...SPRING.quick }).start();
      }}
    >
      <Animated.View style={[itemStyles.innerContainer, { transform: [{ scale }] }]}>
        <Text
          numberOfLines={1}
          ellipsizeMode="clip"
          typography={size === 'large' ? 't5' : 't6'}
          weight={isSelected ? 'bold' : 'semiBold'}
          color={isSelected ? colors.blue[500] : colors.grey[500]}
        >
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const itemStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function Tab({ value, children, onChange, style, size = 'large', ...rest }: TabProps) {
  const [translateX, setTranslateX] = useState(0);
  const animatedTranslateX = useRef(new Animated.Value(translateX)).current;
  const [width, setWidth] = useState(0);
  const indicatorStyle = { width, transform: [{ translateX: animatedTranslateX }] };

  useEffect(() => {
    Animated.spring(animatedTranslateX, {
      toValue: translateX,
      useNativeDriver: true,
      ...SPRING.quick,
    }).start();
  }, [translateX, animatedTranslateX]);

  const borderStyle = { ...styles.border, borderBottomColor: colors.grey[200] };

  return (
    <TabContext.Provider value={{ value, onChange, size }}>
      <IndicatorContext.Provider value={{ width, translateX, setWidth, setTranslateX }}>
        <View>
          <View style={[styles.itemList, style]} accessibilityRole="tablist" {...rest}>
            <View style={styles.padding} />
            {children}
            <View style={styles.padding} />
          </View>
          <View style={borderStyle} />
          <Animated.View
            style={[{ backgroundColor: colors.blue[500] }, styles.indicator, indicatorStyle]}
          />
        </View>
      </IndicatorContext.Provider>
    </TabContext.Provider>
  );
}

const styles = StyleSheet.create({
  padding: {
    width: 20,
    height: 1,
  },
  itemList: {
    flexDirection: 'row',
    width: '100%',
  },
  border: {
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  indicator: {
    height: 2,
    borderRadius: 10,
    bottom: 1,
  },
});

Tab.Item = TabItem;

export default Tab;
