import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { ChevronLeft } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import type { Venue } from '../../src/types/database';

interface TablePreferenceScreenProps {
  navigation: any;
  route: any;
}

const SMOKING_OPTIONS = ['Yes', 'No', 'No preference'];
const LOCATION_OPTIONS = ['Indoor', 'Outdoor', 'Either'];
const SEATING_OPTIONS = ['Near DJ', 'VIP', 'Quiet', 'No preference'];

export default function TablePreferenceScreen({ navigation, route }: TablePreferenceScreenProps) {
  const insets = useSafeAreaInsets();
  const venue = route.params?.venue as Venue | undefined;

  if (!venue) {
    navigation.goBack();
    return null;
  }

  const selectedDate = route.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();
  const selectedTime = route.params?.selectedTime || '8:00 PM';
  const partySize = route.params?.partySize || 4;

  const [smoking, setSmoking] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [seating, setSeating] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Table Preference</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Booking Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {venue.name} • {formatDate(selectedDate)} • {selectedTime} • {partySize} guests
          </Text>
        </View>

        {/* Smoking */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SMOKING</Text>
          <View style={styles.optionsRow}>
            {SMOKING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionPill,
                  smoking === option && styles.optionPillSelected,
                ]}
                onPress={() => setSmoking(smoking === option ? null : option)}
              >
                <Text
                  style={[
                    styles.optionPillText,
                    smoking === option && styles.optionPillTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>LOCATION</Text>
          <View style={styles.optionsRow}>
            {LOCATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionPill,
                  location === option && styles.optionPillSelected,
                ]}
                onPress={() => setLocation(location === option ? null : option)}
              >
                <Text
                  style={[
                    styles.optionPillText,
                    location === option && styles.optionPillTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seating */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SEATING</Text>
          <View style={styles.optionsRow}>
            {SEATING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionPill,
                  seating === option && styles.optionPillSelected,
                ]}
                onPress={() => setSeating(seating === option ? null : option)}
              >
                <Text
                  style={[
                    styles.optionPillText,
                    seating === option && styles.optionPillTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <PrimaryButton
          title="CONTINUE"
          onPress={() => {
            // Ensure venue is passed as a clean object
            navigation.navigate('SpecialRequests', {
              venue: { ...venue },
              selectedDate: selectedDate.toISOString(),
              selectedTime,
              partySize,
              preferences: {
                smoking: smoking || 'No preference',
                location: location || 'Either',
                seating: seating || 'No preference',
              },
            });
          }}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '300',
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
  summary: {
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  summaryText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'transparent',
  },
  optionPillSelected: {
    borderColor: 'rgba(86,132,196,0.4)',
    backgroundColor: 'rgba(86,132,196,0.12)',
  },
  optionPillText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
  optionPillTextSelected: {
    color: '#5684C4',
  },
  bottomButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#0A1628',
  },
});
