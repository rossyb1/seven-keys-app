import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { ChevronLeft } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import type { Venue } from '../../src/types/database';

interface PartySizeScreenProps {
  navigation: any;
  route: any;
}

export default function PartySizeScreen({ navigation, route }: PartySizeScreenProps) {
  const insets = useSafeAreaInsets();
  const venue = route.params?.venue as Venue | undefined;

  if (!venue) {
    navigation.goBack();
    return null;
  }

  const selectedDate = route.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();
  const selectedTime = route.params?.selectedTime || '8:00 PM';
  const [partySize, setPartySize] = useState(4);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const increment = () => {
    if (partySize < 20) setPartySize(partySize + 1);
  };

  const decrement = () => {
    if (partySize > 1) setPartySize(partySize - 1);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Party Size</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Booking Summary */}
        <View style={styles.summary}>
          <Text style={styles.venueName}>{venue.name}</Text>
          <Text style={styles.summaryText}>
            {formatDate(selectedDate)} • {selectedTime}
          </Text>
        </View>

        {/* Party Size Selector */}
        <View style={styles.partySizeSection}>
          <Text style={styles.partySizeLabel}>How many guests?</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepperButton, partySize === 1 && styles.stepperButtonDisabled]}
              onPress={decrement}
              disabled={partySize === 1}
            >
              <Text style={[styles.stepperButtonText, partySize === 1 && styles.stepperButtonTextDisabled]}>
                -
              </Text>
            </TouchableOpacity>
            <View style={styles.stepperValue}>
              <Text style={styles.stepperValueText}>{partySize}</Text>
            </View>
            <TouchableOpacity
              style={[styles.stepperButton, partySize === 20 && styles.stepperButtonDisabled]}
              onPress={increment}
              disabled={partySize === 20}
            >
              <Text style={[styles.stepperButtonText, partySize === 20 && styles.stepperButtonTextDisabled]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>including you</Text>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <PrimaryButton
          title="CONTINUE"
          onPress={() => {
            // Ensure venue is passed as a clean object
            navigation.navigate('TablePreference', {
              venue: { ...venue },
              selectedDate: selectedDate.toISOString(),
              selectedTime,
              partySize,
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
    marginBottom: 60,
    alignItems: 'center',
  },
  venueName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  partySizeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  partySizeLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 40,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepperButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperButtonDisabled: {
    opacity: 0.3,
  },
  stepperButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
  },
  stepperButtonTextDisabled: {
    color: 'rgba(255,255,255,0.3)',
  },
  stepperValue: {
    width: 100,
    alignItems: 'center',
    marginHorizontal: 24,
  },
  stepperValueText: {
    color: '#5684C4',
    fontSize: 56,
    fontWeight: '700',
  },
  helperText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  bottomButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#0A1628',
  },
});
