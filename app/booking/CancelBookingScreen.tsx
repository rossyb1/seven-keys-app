import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar, Clock, Users, AlertTriangle, Check } from 'lucide-react-native';
import { cancelBooking } from '../../src/services/api';
import type { Booking } from '../../src/types/database';
import type { Venue } from '../../src/types/database';

type BookingWithVenue = Booking & { venue: Pick<Venue, 'id' | 'name' | 'type' | 'location' | 'photos'> };

interface CancelBookingScreenProps {
  navigation: any;
  route: any;
}

const CANCELLATION_REASONS = [
  { id: 'plans', label: 'Change of plans' },
  { id: 'better', label: 'Found a better option' },
  { id: 'travel', label: 'Travel plans changed' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'other', label: 'Other' },
];

const BACKGROUND = '#0A1628';
const CARD_BG = '#111D2E';
const ACCENT = '#5684C4';
const DANGER = '#DC2626';
const DANGER_MUTED = 'rgba(220, 38, 38, 0.15)';

export default function CancelBookingScreen({ navigation, route }: CancelBookingScreenProps) {
  const insets = useSafeAreaInsets();
  const booking = route.params?.booking as BookingWithVenue | undefined;
  
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!booking) {
      navigation.goBack();
    }
  }, [booking, navigation]);

  if (!booking) {
    return null;
  }

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
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

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
    if (!selectedReason) return;

    setIsSubmitting(true);

    try {
      const reason = CANCELLATION_REASONS.find(r => r.id === selectedReason)?.label || selectedReason;
      const result = await cancelBooking(booking.id, reason);

      if (result.error) {
        Alert.alert('Error', result.error);
        setIsSubmitting(false);
      } else {
        Alert.alert(
          'Booking Cancelled',
          'Your booking has been cancelled.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('MainTabs', { screen: 'Bookings' }),
            },
          ]
        );
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to cancel booking');
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cancel Booking</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <AlertTriangle size={20} color={DANGER} strokeWidth={2} />
          <Text style={styles.warningBannerText}>This action cannot be undone</Text>
        </View>

        {/* Booking Card */}
        <View style={styles.bookingCard}>
          <Text style={styles.venueName}>{booking.venue?.name || 'Venue'}</Text>
          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Calendar size={16} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
              <Text style={styles.detailText}>{formatDate(booking.booking_date)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={16} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
              <Text style={styles.detailText}>{formatTime(booking.booking_time)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Users size={16} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
              <Text style={styles.detailText}>{booking.party_size} guests</Text>
            </View>
          </View>
        </View>

        {/* Reason Selection */}
        <Text style={styles.sectionTitle}>Reason for cancellation</Text>
        <View style={styles.reasonsContainer}>
          {CANCELLATION_REASONS.map((reason) => {
            const isSelected = selectedReason === reason.id;
            return (
              <TouchableOpacity
                key={reason.id}
                style={[styles.reasonOption, isSelected && styles.reasonOptionSelected]}
                onPress={() => setSelectedReason(reason.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                  {reason.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Policy Notice */}
        <View style={styles.policyBox}>
          <Text style={styles.policyTitle}>Cancellation Policy</Text>
          <Text style={styles.policyText}>
            Cancellations made less than 24 hours before your booking may affect your membership standing. 
            {booking.deposit_required && ' Deposits may be non-refundable depending on venue policy.'}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.cancelButton, !selectedReason && styles.buttonDisabled]}
          onPress={handleCancelBooking}
          disabled={!selectedReason || isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.keepButton}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
          activeOpacity={0.7}
        >
          <Text style={styles.keepButtonText}>Keep My Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DANGER_MUTED,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  warningBannerText: {
    color: DANGER,
    fontSize: 14,
    fontWeight: '500',
  },
  bookingCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  venueName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  bookingDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  reasonsContainer: {
    gap: 8,
    marginBottom: 24,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 12,
  },
  reasonOptionSelected: {
    borderColor: ACCENT,
    backgroundColor: 'rgba(86,132,196,0.08)',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: ACCENT,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ACCENT,
  },
  reasonText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
  },
  reasonTextSelected: {
    color: '#FFFFFF',
  },
  policyBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  policyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  policyText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 20,
  },
  bottomContainer: {
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: BACKGROUND,
    gap: 12,
  },
  cancelButton: {
    backgroundColor: DANGER,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  keepButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  keepButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
