import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { ChevronLeft } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import type { Venue } from '../../src/types/database';

interface SpecialRequestsScreenProps {
  navigation: any;
  route: any;
}

export default function SpecialRequestsScreen({ navigation, route }: SpecialRequestsScreenProps) {
  const insets = useSafeAreaInsets();
  const venue = route.params?.venue as Venue | undefined;

  if (!venue) {
    navigation.goBack();
    return null;
  }

  const selectedDate = route.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();
  const selectedTime = route.params?.selectedTime || '8:00 PM';
  const partySize = route.params?.partySize || 4;
  const preferences = route.params?.preferences || {};

  const [specialRequests, setSpecialRequests] = useState('');

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
          <Text style={styles.headerTitle}>Special Requests</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Booking Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {venue.name} • {formatDate(selectedDate)} • {selectedTime} • {partySize} guests
          </Text>
        </View>

        {/* Special Requests Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Anything else we should know?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Add any special requests..."
            placeholderTextColor={TextColors.tertiary}
            value={specialRequests}
            onChangeText={setSpecialRequests}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.helperText}>
            Examples: birthdays, allergies, accessibility needs
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <PrimaryButton
          title="CONTINUE"
          onPress={() => {
            // Ensure venue is passed as a clean object
            navigation.navigate('ReviewBooking', {
              venue: { ...venue },
              selectedDate: selectedDate.toISOString(),
              selectedTime,
              partySize,
              preferences,
              specialRequests,
            });
          }}
          style={{ marginBottom: Spacing.base }}
        />
        <TouchableOpacity
          style={styles.skipLink}
          onPress={() => {
            // Ensure venue is passed as a clean object
            navigation.navigate('ReviewBooking', {
              venue: { ...venue },
              selectedDate: selectedDate.toISOString(),
              selectedTime,
              partySize,
              preferences,
              specialRequests: '',
            });
          }}
        >
          <Text style={styles.skipLinkText}>Skip this step</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  summary: {
    marginBottom: Spacing.xl * 2,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: AccentColors.border,
  },
  summaryText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
  },
  inputSection: {
    marginBottom: Spacing.xl * 2,
  },
  inputLabel: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.base,
  },
  textInput: {
    backgroundColor: BackgroundColors.secondary,
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    minHeight: 120,
    marginBottom: Spacing.sm,
  },
  helperText: {
    color: TextColors.tertiary,
    fontSize: Typography.fontSize.xs,
  },
  bottomButtonContainer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: AccentColors.border,
    backgroundColor: BackgroundColors.primary,
  },
  skipLink: {
    alignItems: 'center',
  },
  skipLinkText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
  },
});
