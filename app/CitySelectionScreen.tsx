import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, BorderRadius, Typography } from '../constants/brand';
import { ChevronLeft, Check } from '../components/icons/AppIcons';
import PrimaryButton from '../components/buttons/PrimaryButton';

interface CitySelectionScreenProps {
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

export default function CitySelectionScreen({ navigation }: CitySelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const toggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter((c) => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.headline}>Where do you go out?</Text>
          <Text style={styles.subheadline}>Select the cities you frequent</Text>

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
                    <Check size={20} color={AccentColors.primary} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <PrimaryButton
          title="CONTINUE"
          onPress={() => {
            if (selectedCities.length > 0) {
              navigation.navigate('AgeGroup');
            }
          }}
          disabled={selectedCities.length === 0}
          style={{ width: '100%' }}
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
  backButton: {
    padding: Spacing.base,
    alignSelf: 'flex-start',
    paddingTop: Spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
  },
  headline: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  subheadline: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.xl * 2,
  },
  citiesList: {
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
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
    borderColor: 'transparent',
  },
  cityRowSelected: {
    borderColor: AccentColors.primary,
    backgroundColor: BackgroundColors.secondary,
  },
  cityText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
  },
  cityTextSelected: {
    color: AccentColors.primary,
  },
});
