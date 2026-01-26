import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { ChevronLeft, Calendar, Clock, Users, Armchair, FileText, CreditCard, Camera } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { createBooking } from '../../src/services/api';
import type { Venue } from '../../src/types/database';

interface ReviewBookingScreenProps {
  navigation: any;
  route: any;
}

export default function ReviewBookingScreen({ navigation, route }: ReviewBookingScreenProps) {
  const insets = useSafeAreaInsets();
  const venue = route.params?.venue as Venue | undefined;
  const selectedDate = route.params?.selectedDate ? new Date(route.params.selectedDate) : new Date();
  const selectedTime = route.params?.selectedTime || '8:00 PM';
  const partySize = route.params?.partySize || 4;
  const preferences = route.params?.preferences || {};
  const specialRequests = route.params?.specialRequests || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate venue on mount
  useEffect(() => {
    if (!venue) {
      setError('Venue information is missing. Please go back and try again.');
    } else if (!venue.id) {
      setError('Venue ID is missing. Please go back and try again.');
    }
  }, [venue]);

  // If venue is missing, still render but disable functionality
  const isVenueValid = venue && venue.id;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatPreferences = () => {
    const prefs = [];
    if (preferences.smoking && preferences.smoking !== 'No preference') {
      prefs.push(`Smoking: ${preferences.smoking}`);
    }
    if (preferences.location && preferences.location !== 'Either') {
      prefs.push(`Location: ${preferences.location}`);
    }
    if (preferences.seating && preferences.seating !== 'No preference') {
      prefs.push(`Seating: ${preferences.seating}`);
    }
    return prefs.length > 0 ? prefs.join(', ') : 'No preferences';
  };

  // Convert preferences object to table_preference string
  const formatTablePreference = (): string | undefined => {
    const prefs = [];
    if (preferences.smoking && preferences.smoking !== 'No preference') {
      prefs.push(`Smoking: ${preferences.smoking}`);
    }
    if (preferences.location && preferences.location !== 'Either') {
      prefs.push(`Location: ${preferences.location}`);
    }
    if (preferences.seating && preferences.seating !== 'No preference') {
      prefs.push(`Seating: ${preferences.seating}`);
    }
    return prefs.length > 0 ? prefs.join('; ') : undefined;
  };

  // Convert date to YYYY-MM-DD format
  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setError(null);

    // Double-check venue.id is available and is a valid string
    if (!isVenueValid || !venue?.id || typeof venue.id !== 'string' || venue.id.trim() === '') {
      setError('Venue information is missing or invalid. Please go back and try again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const bookingData = {
        venue_id: venue.id.trim(),
        booking_date: formatDateForAPI(selectedDate),
        booking_time: selectedTime,
        party_size: partySize,
        table_preference: formatTablePreference(),
        special_requests: specialRequests || undefined,
      };

      const result = await createBooking(bookingData);

      if (result.error) {
        setError(result.error);
      } else if (result.booking) {
        // Success - navigate to BookingSubmittedScreen with booking
        navigation.navigate('BookingSubmitted', {
          booking: result.booking,
          venue,
        });
      } else {
        setError('Failed to create booking. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Booking</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Venue Image */}
        <View style={styles.venueImageContainer}>
          <LinearGradient
            colors={[BackgroundColors.secondary, BackgroundColors.cardBg]}
            style={styles.venueImage}
          >
            <Camera size={24} color={TextColors.tertiary} strokeWidth={1.5} />
          </LinearGradient>
        </View>

        {/* Venue Info */}
        {venue && (
          <View style={styles.venueInfo}>
            <Text style={styles.venueName}>{venue.name || 'Venue'}</Text>
            <Text style={styles.venueType}>
              {venue.type === 'restaurant' ? 'Restaurant' :
               venue.type === 'beach_club' ? 'Beach Club' :
               venue.type === 'nightclub' ? 'Nightclub' :
               venue.type === 'event' ? 'Event' : venue.type}
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        {/* Booking Details */}
        <View style={styles.detailsList}>
          <View style={styles.detailRow}>
            <Calendar size={20} color={TextColors.secondary} strokeWidth={1.5} />
            <Text style={styles.detailText}>{formatDate(selectedDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Clock size={20} color={TextColors.secondary} strokeWidth={1.5} />
            <Text style={styles.detailText}>{selectedTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Users size={20} color={TextColors.secondary} strokeWidth={1.5} />
            <Text style={styles.detailText}>{partySize} guests</Text>
          </View>
          <View style={styles.detailRow}>
            <Armchair size={20} color={TextColors.secondary} strokeWidth={1.5} />
            <Text style={styles.detailText}>{formatPreferences()}</Text>
          </View>
          {specialRequests && (
            <View style={styles.detailRow}>
              <FileText size={20} color={TextColors.secondary} strokeWidth={1.5} />
              <Text style={styles.detailText}>{specialRequests}</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Deposit Section */}
        <View style={styles.depositSection}>
          <CreditCard size={32} color={TextColors.secondary} strokeWidth={1.5} />
          <Text style={styles.depositLabel}>DEPOSIT</Text>
          <Text style={styles.depositText}>To be confirmed by venue</Text>
          <Text style={styles.depositNote}>
            Payment link will be sent via WhatsApp
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>

      {/* Submit Button */}
      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <PrimaryButton
          title={isSubmitting ? 'CREATING BOOKING...' : 'CONFIRM BOOKING'}
          onPress={handleConfirmBooking}
          disabled={isSubmitting || !isVenueValid}
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
  venueImageContainer: {
    marginBottom: Spacing.base,
  },
  venueImage: {
    width: '100%',
    height: 100,
    borderRadius: BorderRadius.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  venueInfo: {
    marginBottom: Spacing.base,
  },
  venueName: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
  },
  venueType: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
  },
  divider: {
    height: 1,
    backgroundColor: AccentColors.border,
    marginVertical: Spacing.xl,
  },
  detailsList: {
    // gap property not supported in React Native StyleSheet
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.base,
  },
  detailText: {
    flex: 1,
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    marginLeft: Spacing.base,
  },
  depositSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl * 2,
  },
  depositLabel: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  depositText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.xs,
  },
  depositNote: {
    color: TextColors.tertiary,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
  bottomButtonContainer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: AccentColors.border,
    backgroundColor: BackgroundColors.primary,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginTop: Spacing.base,
    marginBottom: Spacing.xl,
  },
  errorText: {
    color: '#EF4444',
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
});
