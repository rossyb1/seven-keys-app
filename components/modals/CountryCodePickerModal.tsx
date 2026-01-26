import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';

export interface Country {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
}

export const COUNTRIES: Country[] = [
  { code: 'AE', dialCode: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'SA', dialCode: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: 'QA', dialCode: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: 'KW', dialCode: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: 'BH', dialCode: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: 'OM', dialCode: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'PK', dialCode: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: 'PH', dialCode: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'France' },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: 'IT', dialCode: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: 'ES', dialCode: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: 'RU', dialCode: '+7', flag: '🇷🇺', name: 'Russia' },
  { code: 'CN', dialCode: '+86', flag: '🇨🇳', name: 'China' },
  { code: 'JP', dialCode: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Australia' },
];

interface CountryCodePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
}

export default function CountryCodePickerModal({
  visible,
  onClose,
  selectedCountry,
  onSelectCountry,
}: CountryCodePickerModalProps) {
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
            <Text style={styles.title}>Select Country</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={TextColors.primary} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          {/* Countries List */}
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={[
                  styles.countryItem,
                  selectedCountry.code === country.code && styles.countryItemActive,
                ]}
                onPress={() => {
                  onSelectCountry(country);
                  onClose();
                }}
              >
                <View style={styles.countryInfo}>
                  <Text style={styles.flag}>{country.flag}</Text>
                  <View style={styles.countryDetails}>
                    <Text style={styles.countryName}>{country.name}</Text>
                    <Text style={styles.dialCode}>{country.dialCode}</Text>
                  </View>
                </View>
                {selectedCountry.code === country.code && (
                  <Check size={20} color={AccentColors.primary} strokeWidth={2} />
                )}
              </TouchableOpacity>
            ))}
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
  scrollView: {
    maxHeight: 500,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.xs,
    backgroundColor: BackgroundColors.secondary,
  },
  countryItemActive: {
    backgroundColor: 'rgba(86, 132, 196, 0.1)',
    borderWidth: 1,
    borderColor: AccentColors.primary,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 28,
    marginRight: Spacing.base,
  },
  countryDetails: {
    flex: 1,
  },
  countryName: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    marginBottom: 2,
  },
  dialCode: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
  },
});
