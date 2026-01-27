import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/brand';
import { ChevronLeft, Check } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';

interface PreferredCitiesScreenProps {
  navigation: any;
}

const CITIES = [
  'Dubai',
  'London',
  'Ibiza',
  'Marbella',
  'South of France',
  'Tulum',
  'Las Vegas',
  'Other',
];

export default function PreferredCitiesScreen({ navigation }: PreferredCitiesScreenProps) {
  const [selectedCities, setSelectedCities] = useState<string[]>(['Dubai', 'London', 'Ibiza']);

  const toggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter((c) => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Preferred Cities</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Subtext */}
        <Text style={styles.subtext}>Select the cities you frequent</Text>

        {/* Cities List */}
        <View style={styles.citiesList}>
          {CITIES.map((city) => {
            const isSelected = selectedCities.includes(city);
            return (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityRow,
                  isSelected && styles.cityRowSelected,
                ]}
                onPress={() => toggleCity(city)}
              >
                <Text
                  style={[
                    styles.cityText,
                    isSelected && styles.cityTextSelected,
                  ]}
                >
                  {city}
                </Text>
                {isSelected && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomButtonContainer}>
        <PrimaryButton
          title="SAVE CHANGES"
          onPress={() => {
            // Handle save
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColors.primary,
  },
  content: {
    flex: 1,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    flex: 1,
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  subtext: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.xl * 2,
  },
  citiesList: {
    marginBottom: Spacing.xl * 2,
  },
  cityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: AccentColors.borderLight,
    backgroundColor: BackgroundColors.cardBg,
    minHeight: 56,
    ...Shadows.sm,
  },
  cityRowSelected: {
    borderColor: AccentColors.primary,
    backgroundColor: 'rgba(86, 132, 196, 0.1)',
  },
  cityText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
  },
  cityTextSelected: {
    color: AccentColors.primary,
  },
  checkmark: {
    color: AccentColors.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
  },
  bottomButtonContainer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: AccentColors.border,
    backgroundColor: BackgroundColors.primary,
  },
});
