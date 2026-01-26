import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView, TextInput } from 'react-native';
import { X, Check, Search } from 'lucide-react-native';
import { BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';

export interface Nationality {
  flag: string;
  name: string;
}

// Common nationalities at the top, then alphabetical
export const NATIONALITIES: Nationality[] = [
  // Common ones first
  { flag: '🇦🇪', name: 'Emirati' },
  { flag: '🇬🇧', name: 'British' },
  { flag: '🇺🇸', name: 'American' },
  { flag: '🇸🇦', name: 'Saudi' },
  { flag: '🇶🇦', name: 'Qatari' },
  { flag: '🇰🇼', name: 'Kuwaiti' },
  { flag: '🇧🇭', name: 'Bahraini' },
  { flag: '🇴🇲', name: 'Omani' },
  { flag: '🇮🇳', name: 'Indian' },
  { flag: '🇵🇰', name: 'Pakistani' },
  { flag: '🇵🇭', name: 'Filipino' },
  { flag: '🇱🇧', name: 'Lebanese' },
  { flag: '🇯🇴', name: 'Jordanian' },
  { flag: '🇪🇬', name: 'Egyptian' },
  { flag: '🇫🇷', name: 'French' },
  { flag: '🇩🇪', name: 'German' },
  { flag: '🇮🇹', name: 'Italian' },
  { flag: '🇪🇸', name: 'Spanish' },
  { flag: '🇷🇺', name: 'Russian' },
  { flag: '🇨🇳', name: 'Chinese' },
  { flag: '🇯🇵', name: 'Japanese' },
  { flag: '🇰🇷', name: 'South Korean' },
  { flag: '🇦🇺', name: 'Australian' },
  { flag: '🇨🇦', name: 'Canadian' },
  { flag: '🇧🇷', name: 'Brazilian' },
  { flag: '🇿🇦', name: 'South African' },
  { flag: '🇳🇬', name: 'Nigerian' },
  // Alphabetical from here
  { flag: '🇦🇫', name: 'Afghan' },
  { flag: '🇦🇱', name: 'Albanian' },
  { flag: '🇩🇿', name: 'Algerian' },
  { flag: '🇦🇷', name: 'Argentine' },
  { flag: '🇦🇲', name: 'Armenian' },
  { flag: '🇦🇹', name: 'Austrian' },
  { flag: '🇦🇿', name: 'Azerbaijani' },
  { flag: '🇧🇩', name: 'Bangladeshi' },
  { flag: '🇧🇾', name: 'Belarusian' },
  { flag: '🇧🇪', name: 'Belgian' },
  { flag: '🇧🇴', name: 'Bolivian' },
  { flag: '🇧🇦', name: 'Bosnian' },
  { flag: '🇧🇬', name: 'Bulgarian' },
  { flag: '🇰🇭', name: 'Cambodian' },
  { flag: '🇨🇲', name: 'Cameroonian' },
  { flag: '🇨🇱', name: 'Chilean' },
  { flag: '🇨🇴', name: 'Colombian' },
  { flag: '🇨🇷', name: 'Costa Rican' },
  { flag: '🇭🇷', name: 'Croatian' },
  { flag: '🇨🇺', name: 'Cuban' },
  { flag: '🇨🇿', name: 'Czech' },
  { flag: '🇩🇰', name: 'Danish' },
  { flag: '🇩🇴', name: 'Dominican' },
  { flag: '🇪🇨', name: 'Ecuadorian' },
  { flag: '🇪🇪', name: 'Estonian' },
  { flag: '🇪🇹', name: 'Ethiopian' },
  { flag: '🇫🇮', name: 'Finnish' },
  { flag: '🇬🇪', name: 'Georgian' },
  { flag: '🇬🇭', name: 'Ghanaian' },
  { flag: '🇬🇷', name: 'Greek' },
  { flag: '🇬🇹', name: 'Guatemalan' },
  { flag: '🇭🇳', name: 'Honduran' },
  { flag: '🇭🇰', name: 'Hong Konger' },
  { flag: '🇭🇺', name: 'Hungarian' },
  { flag: '🇮🇸', name: 'Icelandic' },
  { flag: '🇮🇩', name: 'Indonesian' },
  { flag: '🇮🇷', name: 'Iranian' },
  { flag: '🇮🇶', name: 'Iraqi' },
  { flag: '🇮🇪', name: 'Irish' },
  { flag: '🇮🇱', name: 'Israeli' },
  { flag: '🇯🇲', name: 'Jamaican' },
  { flag: '🇰🇿', name: 'Kazakhstani' },
  { flag: '🇰🇪', name: 'Kenyan' },
  { flag: '🇰🇬', name: 'Kyrgyzstani' },
  { flag: '🇱🇦', name: 'Laotian' },
  { flag: '🇱🇻', name: 'Latvian' },
  { flag: '🇱🇾', name: 'Libyan' },
  { flag: '🇱🇹', name: 'Lithuanian' },
  { flag: '🇱🇺', name: 'Luxembourgish' },
  { flag: '🇲🇾', name: 'Malaysian' },
  { flag: '🇲🇽', name: 'Mexican' },
  { flag: '🇲🇩', name: 'Moldovan' },
  { flag: '🇲🇦', name: 'Moroccan' },
  { flag: '🇲🇿', name: 'Mozambican' },
  { flag: '🇲🇲', name: 'Myanmar' },
  { flag: '🇳🇱', name: 'Dutch' },
  { flag: '🇳🇿', name: 'New Zealander' },
  { flag: '🇳🇮', name: 'Nicaraguan' },
  { flag: '🇳🇴', name: 'Norwegian' },
  { flag: '🇵🇦', name: 'Panamanian' },
  { flag: '🇵🇾', name: 'Paraguayan' },
  { flag: '🇵🇪', name: 'Peruvian' },
  { flag: '🇵🇱', name: 'Polish' },
  { flag: '🇵🇹', name: 'Portuguese' },
  { flag: '🇵🇷', name: 'Puerto Rican' },
  { flag: '🇷🇴', name: 'Romanian' },
  { flag: '🇸🇬', name: 'Singaporean' },
  { flag: '🇸🇰', name: 'Slovak' },
  { flag: '🇸🇮', name: 'Slovenian' },
  { flag: '🇸🇴', name: 'Somali' },
  { flag: '🇿🇼', name: 'Zimbabwean' },
  { flag: '🇸🇪', name: 'Swedish' },
  { flag: '🇨🇭', name: 'Swiss' },
  { flag: '🇸🇾', name: 'Syrian' },
  { flag: '🇹🇼', name: 'Taiwanese' },
  { flag: '🇹🇿', name: 'Tanzanian' },
  { flag: '🇹🇭', name: 'Thai' },
  { flag: '🇹🇷', name: 'Turkish' },
  { flag: '🇺🇦', name: 'Ukrainian' },
  { flag: '🇦🇪', name: 'UAE' },
  { flag: '🇬🇧', name: 'UK' },
  { flag: '🇺🇾', name: 'Uruguayan' },
  { flag: '🇻🇪', name: 'Venezuelan' },
  { flag: '🇻🇳', name: 'Vietnamese' },
  { flag: '🇾🇪', name: 'Yemeni' },
];

interface NationalityPickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedNationality: Nationality | null;
  onSelectNationality: (nationality: Nationality) => void;
}

export default function NationalityPickerModal({
  visible,
  onClose,
  selectedNationality,
  onSelectNationality,
}: NationalityPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNationalities = NATIONALITIES.filter((nationality) =>
    nationality.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Text style={styles.title}>Select Nationality</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={TextColors.primary} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={20} color={TextColors.secondary} strokeWidth={1.5} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search nationality..."
              placeholderTextColor={TextColors.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Nationalities List */}
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {filteredNationalities.length > 0 ? (
              filteredNationalities.map((nationality, index) => {
                const isSelected = selectedNationality?.name === nationality.name;
                return (
                  <TouchableOpacity
                    key={`${nationality.name}-${index}`}
                    style={[
                      styles.nationalityItem,
                      isSelected && styles.nationalityItemActive,
                    ]}
                    onPress={() => {
                      onSelectNationality(nationality);
                      onClose();
                    }}
                  >
                    <View style={styles.nationalityInfo}>
                      <Text style={styles.flag}>{nationality.flag}</Text>
                      <Text style={styles.nationalityName}>{nationality.name}</Text>
                    </View>
                    {isSelected && (
                      <Check size={20} color={AccentColors.primary} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No nationalities found</Text>
                <Text style={styles.emptyStateSubtext}>Try a different search term</Text>
              </View>
            )}
          </ScrollView>
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
    marginBottom: Spacing.lg,
  },
  title: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
  },
  closeButton: {
    padding: Spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BackgroundColors.secondary,
    borderRadius: BorderRadius.base,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: AccentColors.border,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    paddingVertical: Spacing.base,
  },
  scrollView: {
    maxHeight: 500,
  },
  nationalityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.xs,
    backgroundColor: BackgroundColors.secondary,
  },
  nationalityItemActive: {
    backgroundColor: 'rgba(86, 132, 196, 0.1)',
    borderWidth: 1,
    borderColor: AccentColors.primary,
  },
  nationalityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 28,
    marginRight: Spacing.base,
  },
  nationalityName: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
  emptyState: {
    paddingVertical: Spacing.xl * 2,
    alignItems: 'center',
  },
  emptyStateText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  emptyStateSubtext: {
    color: TextColors.tertiary,
    fontSize: Typography.fontSize.sm,
  },
});
