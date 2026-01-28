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
    backgroundColor: '#0A1628',
  },
  content: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 24,
  },
  subtext: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginBottom: 24,
  },
  citiesList: {
    marginBottom: 40,
  },
  cityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    minHeight: 56,
  },
  cityRowSelected: {
    borderColor: 'rgba(86,132,196,0.4)',
    backgroundColor: 'rgba(86,132,196,0.1)',
  },
  cityText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  cityTextSelected: {
    color: '#5684C4',
  },
  checkmark: {
    color: '#5684C4',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#0A1628',
  },
});
