import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedType: string;
  selectedVibe: string | null;
  onTypeChange: (type: string) => void;
  onVibeChange: (vibe: string | null) => void;
  onReset: () => void;
}

const VENUE_TYPES = ['All', 'Restaurants', 'Beach Clubs', 'Nightclubs', 'Events'];
const VIBES = ['Relaxed', 'Party', 'Family', 'Date Night'];

export default function FilterModal({
  visible,
  onClose,
  selectedType,
  selectedVibe,
  onTypeChange,
  onVibeChange,
  onReset,
}: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={TextColors.primary} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          {/* Venue Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>VENUE TYPE</Text>
            <View style={styles.optionsGrid}>
              {VENUE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionChip,
                    selectedType === type && styles.optionChipActive,
                  ]}
                  onPress={() => onTypeChange(type)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedType === type && styles.optionTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                  {selectedType === type && (
                    <Check size={16} color={AccentColors.primary} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Vibe */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>VIBE</Text>
            <View style={styles.optionsGrid}>
              {VIBES.map((vibe) => (
                <TouchableOpacity
                  key={vibe}
                  style={[
                    styles.optionChip,
                    selectedVibe === vibe && styles.optionChipActive,
                  ]}
                  onPress={() => onVibeChange(selectedVibe === vibe ? null : vibe)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedVibe === vibe && styles.optionTextActive,
                    ]}
                  >
                    {vibe}
                  </Text>
                  {selectedVibe === vibe && (
                    <Check size={16} color={AccentColors.primary} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.resetButton} onPress={onReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: BackgroundColors.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: Spacing.xl,
    paddingBottom: 40,
    paddingHorizontal: Spacing.xl,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
  },
  closeButton: {
    padding: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: Spacing.base,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.sm / 2,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: AccentColors.border,
    backgroundColor: BackgroundColors.cardBg,
    marginHorizontal: Spacing.sm / 2,
    marginBottom: Spacing.sm,
  },
  optionChipActive: {
    borderColor: AccentColors.primary,
    backgroundColor: 'rgba(86, 132, 196, 0.1)',
  },
  optionText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
  },
  optionTextActive: {
    color: AccentColors.primary,
    marginRight: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    marginTop: Spacing.base,
  },
  resetButton: {
    flex: 1,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    marginRight: Spacing.base,
  },
  resetButtonText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
  applyButton: {
    flex: 2,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    backgroundColor: AccentColors.primary,
    borderRadius: BorderRadius.base,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
});
