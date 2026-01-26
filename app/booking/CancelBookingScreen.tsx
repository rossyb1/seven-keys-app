import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ChevronLeft, Check } from '../../components/icons/AppIcons';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { cancelBooking } from '../../src/services/api';
import type { Booking } from '../../src/types/database';
import type { Venue } from '../../src/types/database';

type BookingWithVenue = Booking & { venue: Pick<Venue, 'id' | 'name' | 'type' | 'location' | 'photos'> };

interface CancelBookingScreenProps {
  navigation: any;
  route: any;
}

const CANCELLATION_REASONS = [
  'Change of plans',
  'Found a better option',
  'Travel plans changed',
  'Emergency',
  'Other',
];

export default function CancelBookingScreen({ navigation, route }: CancelBookingScreenProps) {
  const booking = route.params?.booking as BookingWithVenue | undefined;
  
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!booking) {
      navigation.goBack();
    }
  }, [booking, navigation]);

  if (!booking) {
    return null;
  }

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (bookingDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Helper function to format time
  const formatTime = (timeString: string): string => {
    if (timeString.includes('PM') || timeString.includes('AM')) {
      return timeString;
    }
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes || '00'} ${ampm}`;
  };

  const handleCancelBooking = async () => {
    if (!selectedReason) {
      setError('Please select a cancellation reason');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await cancelBooking(booking.id, selectedReason);

      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else {
        // Show success message and navigate back
        Alert.alert(
          'Booking Cancelled',
          'Your booking has been cancelled successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to BookingsScreen
                navigation.navigate('MainTabs', { screen: 'Bookings' });
              },
            },
          ]
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking');
      setIsSubmitting(false);
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
          <Text style={styles.headerTitle}>Cancel Booking</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Headline */}
        <Text style={styles.headline}>Are you sure you want to cancel?</Text>

        {/* Booking Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryVenueName}>{booking.venue?.name || 'Unknown Venue'}</Text>
          <Text style={styles.summaryDate}>{formatDate(booking.booking_date)}</Text>
          <Text style={styles.summaryTime}>{formatTime(booking.booking_time)}</Text>
          <Text style={styles.summaryGuests}>{booking.party_size} guests</Text>
        </View>

        {/* Cancellation Reasons */}
        <Text style={styles.reasonsTitle}>Why are you cancelling?</Text>
        <View style={styles.reasonsList}>
          {CANCELLATION_REASONS.map((reason) => (
            <TouchableOpacity
              key={reason}
              style={[
                styles.reasonOption,
                selectedReason === reason && styles.reasonOptionSelected,
              ]}
              onPress={() => {
                setSelectedReason(reason);
                setError(null);
              }}
            >
              <Text
                style={[
                  styles.reasonText,
                  selectedReason === reason && styles.reasonTextSelected,
                ]}
              >
                {reason}
              </Text>
              {selectedReason === reason && (
                <Check size={20} color={AccentColors.primary} strokeWidth={2} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Warning Box - Only show if deposit was required */}
        {booking.deposit_required && (
          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningTitle}>CANCELLATION POLICY</Text>
            <Text style={styles.warningText}>
              Deposits may be non-refundable depending on venue policy and timing.
            </Text>
            {booking.minimum_spend && (
              <Text style={styles.warningDeposit}>
                Deposit: AED {booking.minimum_spend.toLocaleString()}
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[
            styles.cancelButton,
            (!selectedReason || isSubmitting) && styles.cancelButtonDisabled,
          ]}
          onPress={handleCancelBooking}
          disabled={!selectedReason || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={TextColors.primary} />
          ) : (
            <Text style={styles.cancelButtonText}>YES, CANCEL BOOKING</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.keepButton}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text style={styles.keepButtonText}>KEEP BOOKING</Text>
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
  backArrow: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '300',
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
  headline: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  summaryVenueName: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  summaryDate: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.xs / 2,
  },
  summaryTime: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.xs / 2,
  },
  summaryGuests: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
  },
  reasonsTitle: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    marginBottom: Spacing.base,
  },
  reasonsList: {
    marginBottom: Spacing.xl,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
  },
  reasonOptionSelected: {
    borderColor: AccentColors.primary,
    backgroundColor: 'rgba(86, 132, 196, 0.1)',
  },
  reasonText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
  reasonTextSelected: {
    color: AccentColors.primary,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
  },
  errorText: {
    color: '#EF4444',
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
  warningBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: BorderRadius.base,
    padding: Spacing.xl,
    marginBottom: Spacing.xl * 2,
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 32,
    marginBottom: Spacing.base,
  },
  warningTitle: {
    color: '#EF4444',
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: Spacing.base,
  },
  warningText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: Spacing.base,
    lineHeight: 20,
  },
  warningDeposit: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
  bottomButtonContainer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: AccentColors.border,
    backgroundColor: BackgroundColors.primary,
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  cancelButtonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    letterSpacing: 1,
  },
  keepButton: {
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  keepButtonText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
