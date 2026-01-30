import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackgroundColors, TextColors, AccentColors, Typography, BorderRadius, Spacing } from '../constants/brand';
import { ChevronLeft, Check } from '../components/icons/AppIcons';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/contexts/AuthContext';

interface CitySelectionScreenProps {
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

export default function CitySelectionScreen({ navigation }: CitySelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshUser } = useAuth();

  const toggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter((c) => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const handleContinue = async () => {
    if (selectedCities.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { error } = await supabase
          .from('users')
          .update({ preferred_cities: JSON.stringify(selectedCities) })
          .eq('id', authUser.id);
        
        if (error) {
          console.error('Error saving cities:', error);
          Alert.alert('Error', 'Failed to save your preferences. Please try again.');
          setIsSubmitting(false);
          return;
        }
        
        console.log('✅ Cities saved:', selectedCities);
      }
      
      navigation.navigate('AgeGroup');
    } catch (error) {
      console.error('Error in handleContinue:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={20} color={TextColors.primary} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.headline}>Your cities</Text>
          <View style={styles.accentLine} />
          <Text style={styles.subheadline}>
            Where should we unlock doors for you?
          </Text>
        </View>

        {/* Cities List */}
        <View style={styles.citiesContainer}>
          {CITIES.map((city) => {
            const isSelected = selectedCities.includes(city.name);
            return (
              <TouchableOpacity
                key={city.name}
                style={[
                  styles.cityCard,
                  isSelected && styles.cityCardSelected,
                ]}
                onPress={() => toggleCity(city.name)}
                activeOpacity={0.7}
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

      {/* Bottom Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedCities.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedCities.length === 0 || isSubmitting}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            selectedCities.length === 0 && styles.continueButtonTextDisabled,
          ]}>
            {isSubmitting ? 'SAVING...' : 'CONTINUE'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColors.primary,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BackgroundColors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  titleSection: {
    marginBottom: Spacing['2xl'],
  },
  headline: {
    color: TextColors.primary,
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '300',
    letterSpacing: 1,
  },
  accentLine: {
    width: 40,
    height: 2,
    backgroundColor: AccentColors.primary,
    marginVertical: Spacing.base,
  },
  subheadline: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    lineHeight: 24,
  },
  citiesContainer: {
    gap: Spacing.md,
  },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BackgroundColors.cardBg,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: AccentColors.border,
  },
  cityCardSelected: {
    backgroundColor: AccentColors.primaryMuted,
    borderColor: AccentColors.primary,
  },
  cityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cityEmoji: {
    fontSize: 20,
  },
  cityText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
  cityTextSelected: {
    color: AccentColors.primary,
  },
  checkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AccentColors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
  },
  continueButton: {
    backgroundColor: AccentColors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: BackgroundColors.cardBg,
  },
  continueButtonText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    letterSpacing: 2,
  },
  continueButtonTextDisabled: {
    color: TextColors.tertiary,
  },
});
