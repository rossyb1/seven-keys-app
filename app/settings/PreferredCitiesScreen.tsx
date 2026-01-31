import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/brand';
import { ChevronLeft, Check } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { supabase } from '../../src/lib/supabase';

interface PreferredCitiesScreenProps {
  navigation: any;
}

const CITIES = [
  { name: 'Dubai', emoji: '🇦🇪' },
  { name: 'London', emoji: '🇬🇧' },
  { name: 'Ibiza', emoji: '🇪🇸' },
  { name: 'Marbella', emoji: '🇪🇸' },
  { name: 'South of France', emoji: '🇫🇷' },
  { name: 'Tulum', emoji: '🇲🇽' },
  { name: 'Las Vegas', emoji: '🇺🇸' },
  { name: 'Other', emoji: '🌍' },
];

export default function PreferredCitiesScreen({ navigation }: PreferredCitiesScreenProps) {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load user's current preferred cities on mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('users')
            .select('preferred_cities')
            .eq('id', user.id)
            .single();

          if (profile?.preferred_cities) {
            // Handle both array and string formats
            const cities = Array.isArray(profile.preferred_cities)
              ? profile.preferred_cities
              : JSON.parse(profile.preferred_cities);
            setSelectedCities(cities);
          }
        }
      } catch (error) {
        console.error('Error loading cities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCities();
  }, []);

  const toggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter((c) => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const handleSave = async () => {
    if (selectedCities.length === 0) {
      Alert.alert('Select Cities', 'Please select at least one city.');
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('users')
          .update({ preferred_cities: selectedCities })
          .eq('id', user.id);

        if (error) throw error;

        Alert.alert('Saved', 'Your preferred cities have been updated.');
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Error saving cities:', error);
      Alert.alert('Error', 'Failed to save your preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AccentColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
            const isSelected = selectedCities.includes(city.name);
            return (
              <TouchableOpacity
                key={city.name}
                style={[
                  styles.cityRow,
                  isSelected && styles.cityRowSelected,
                ]}
                onPress={() => toggleCity(city.name)}
              >
                <View style={styles.cityContent}>
                  <Text style={styles.cityEmoji}>{city.emoji}</Text>
                  <Text
                    style={[
                      styles.cityText,
                      isSelected && styles.cityTextSelected,
                    ]}
                  >
                    {city.name}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkContainer}>
                    <Check size={16} color={AccentColors.primary} strokeWidth={2.5} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomButtonContainer}>
        <PrimaryButton
          title={isSaving ? "SAVING..." : "SAVE CHANGES"}
          onPress={handleSave}
          disabled={isSaving}
        />
      </View>
    </SafeAreaView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    gap: 12,
    marginBottom: 40,
  },
  cityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    minHeight: 56,
  },
  cityRowSelected: {
    borderColor: 'rgba(86,132,196,0.4)',
    backgroundColor: 'rgba(86,132,196,0.1)',
  },
  cityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cityEmoji: {
    fontSize: 20,
  },
  cityText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  cityTextSelected: {
    color: '#5684C4',
  },
  checkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(86,132,196,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#0A1628',
  },
});
