import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { Check } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import type { Booking, Venue } from '../../src/types/database';

interface BookingSubmittedScreenProps {
  navigation: any;
  route: any;
}

export default function BookingSubmittedScreen({ navigation, route }: BookingSubmittedScreenProps) {
  const booking = route.params?.booking as Booking | undefined;
  const venue = route.params?.venue as Venue | undefined;

  // Fallback if booking/venue not passed
  if (!booking || !venue) {
    // Navigate back if no booking data
    navigation.goBack();
    return null;
  }

  // Format booking date for display
  const formatBookingDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Checkmark */}
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>We're On It</Text>

        {/* Description */}
        <Text style={styles.description}>
          Our team is securing your table at {venue.name} on {formatBookingDate(booking.booking_date)} at {booking.booking_time}. We'll notify you once confirmed — most tables are secured within the hour.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <PrimaryButton
            title="VIEW BOOKING"
            onPress={() => {
              // Navigate to MainTabs with Bookings tab active, and optionally pass booking ID
              navigation.navigate('MainTabs', {
                screen: 'Bookings',
                params: { bookingId: booking.id },
              });
            }}
            style={{ width: '100%', marginBottom: Spacing.base }}
          />

          <TouchableOpacity
            style={styles.backToHomeLink}
            onPress={() => {
              // Navigate to MainTabs with Home tab active
              navigation.navigate('MainTabs', {
                screen: 'Home',
              });
            }}
          >
            <Text style={styles.backToHomeLinkText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  checkmarkContainer: {
    marginBottom: Spacing.xl * 2,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AccentColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: BrandColors.black,
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '700',
  },
  headline: {
    color: TextColors.primary,
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.light,
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  description: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.xl * 2,
    paddingHorizontal: Spacing.xl,
    lineHeight: 24,
    fontFamily: Typography.fontFamily.regular,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  backToHomeLink: {
    padding: Spacing.base,
  },
  backToHomeLinkText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
  },
});
