import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { ChevronLeft } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import type { Venue } from '../../src/types/database';

interface SelectTimeScreenProps {
  navigation: any;
  route: any;
}

const TIME_SLOTS = [
  '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM',
  '9:00 PM', '10:00 PM', '11:00 PM',
];

export default function SelectTimeScreen({ navigation, route }: SelectTimeScreenProps) {
  const insets = useSafeAreaInsets();
  const venue = route.params?.venue as Venue | undefined;

  if (!venue) {
    navigation.goBack();
    return null;
  }

  const selectedDate = route.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Time</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Venue Info */}
        <View style={styles.venueInfo}>
          <Text style={styles.venueName}>{venue.name}</Text>
          <Text style={styles.selectedDate}>{formatDate(selectedDate)}</Text>
        </View>

        {/* Time Selection */}
        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>What time would you like to arrive?</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected,
                  ]}
                >
                  {time}
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
            if (selectedTime) {
              // Ensure venue is passed as a clean object
              navigation.navigate('PartySize', {
                venue: { ...venue },
                selectedDate: selectedDate.toISOString(),
                selectedTime,
              });
            }
          }}
          disabled={!selectedTime}
        />
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
  venueInfo: {
    marginBottom: Spacing.xl * 2,
  },
  venueName: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
  },
  selectedDate: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
  },
  timeSection: {
    marginBottom: Spacing.xl * 2,
  },
  timeLabel: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.base,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap property not supported in React Native StyleSheet
  },
  timeSlot: {
    width: '30%',
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  timeSlotSelected: {
    borderColor: AccentColors.primary,
    borderWidth: 2,
    backgroundColor: 'rgba(86, 132, 196, 0.1)',
  },
  timeSlotText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: AccentColors.primary,
  },
  bottomButtonContainer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: AccentColors.border,
    backgroundColor: BackgroundColors.primary,
  },
});
