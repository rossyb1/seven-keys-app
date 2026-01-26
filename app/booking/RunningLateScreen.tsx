import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { ChevronLeft, Check } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';

interface RunningLateScreenProps {
  navigation: any;
  route: any;
}

const LATE_OPTIONS = [
  { minutes: 15, label: '15 minutes' },
  { minutes: 30, label: '30 minutes' },
  { minutes: 45, label: '45 minutes' },
  { minutes: 60, label: 'More than 45 minutes' },
];

export default function RunningLateScreen({ navigation, route }: RunningLateScreenProps) {
  const booking = route.params?.booking || {
    venueName: 'Twiggy by La Cantine',
    date: 'Tomorrow',
  };
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successContainer}>
            <View style={styles.checkmarkCircle}>
              <Check size={40} color={BrandColors.black} strokeWidth={3} />
            </View>
            <Text style={styles.successHeadline}>Venue Notified</Text>
            <Text style={styles.successText}>
              We've let {booking.venueName} know you'll be {selectedMinutes} minutes late.
            </Text>
            <PrimaryButton
              title="DONE"
              onPress={() => navigation.goBack()}
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Running Late</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Booking Info */}
        <View style={styles.bookingInfo}>
          <Text style={styles.venueName}>{booking.venueName}</Text>
          <Text style={styles.bookingDate}>{booking.date}</Text>
        </View>

        {/* Time Selection */}
        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>How late will you be?</Text>
          <View style={styles.optionsList}>
            {LATE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.minutes}
                style={[
                  styles.optionCard,
                  selectedMinutes === option.minutes && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedMinutes(option.minutes)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedMinutes === option.minutes && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtonContainer}>
        <PrimaryButton
          title="NOTIFY VENUE"
          onPress={() => {
            if (selectedMinutes) {
              setIsSubmitted(true);
            }
          }}
          disabled={!selectedMinutes}
          style={{ width: '100%', marginBottom: Spacing.base }}
        />
        <TouchableOpacity
          style={styles.cancelLink}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelLinkText}>Cancel</Text>
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
  bookingInfo: {
    marginBottom: Spacing.xl * 2,
  },
  venueName: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
  },
  bookingDate: {
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
  optionsList: {
    gap: Spacing.base,
  },
  optionCard: {
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    minHeight: 60,
    justifyContent: 'center',
  },
  optionCardSelected: {
    borderColor: AccentColors.primary,
    borderWidth: 2,
    backgroundColor: 'rgba(86, 132, 196, 0.1)',
  },
  optionText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: AccentColors.primary,
  },
  bottomButtonContainer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: AccentColors.border,
    backgroundColor: BackgroundColors.primary,
  },
  cancelLink: {
    alignItems: 'center',
  },
  cancelLinkText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AccentColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  successHeadline: {
    color: TextColors.primary,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '600',
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  successText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.xl * 2,
    lineHeight: 24,
  },
});
