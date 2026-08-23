import { useState } from 'react';
import { FlatList, Modal, Pressable as RNPressable, StyleSheet, View } from 'react-native';
import { ChevronDownIcon } from '@/assets/icons/common';
import { Pressable, Text } from '@/shared/components/base';
import { colors } from '@/shared/constants/colors';

export interface RegionPickerOption {
  code: string;
  name: string;
}

interface Props {
  label: string;
  value: string | null;
  options: RegionPickerOption[];
  disabled?: boolean;
  onSelect: (code: string) => void;
}

export default function RegionPicker({ label, value, options, disabled = false, onSelect }: Props) {
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

const styles = StyleSheet.create({
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
