import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'lucide-react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import BookingCard from '../../components/cards/BookingCard';
import { getUserBookings } from '../../src/services/api';
import type { Booking } from '../../src/types/database';
import type { Venue } from '../../src/types/database';

interface BookingsScreenProps {
  navigation: any;
}

type BookingWithVenue = Booking & { venue: Pick<Venue, 'id' | 'name' | 'type' | 'location' | 'photos'> };

export default function BookingsScreen({ navigation }: BookingsScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<BookingWithVenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchBookings = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const result = await getUserBookings();
          
          if (result.error) {
            setError(result.error);
            setBookings([]);
          } else {
            setBookings(result.bookings);
          }
        } catch (err: any) {
          setError(err.message || 'Failed to load bookings');
          setBookings([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBookings();
    }, [])
  );

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

  // Helper function to map database status to display status
  const mapStatusToDisplay = (status: Booking['status']): 'CONFIRMED' | 'CONFIRMING' | 'COMPLETED' | 'CANCELLED' => {
    switch (status) {
      case 'confirmed':
      case 'deposit_confirmed':
        return 'CONFIRMED';
      case 'pending':
      case 'awaiting_info':
      case 'deposit_pending':
      case 'counter_offer':
        return 'CONFIRMING';
      case 'completed':
        return 'COMPLETED';
      case 'cancelled':
      case 'rejected':
        return 'CANCELLED';
      default:
        return 'CONFIRMING';
    }
  };

  // Separate bookings into upcoming and past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.booking_date);
    bookingDate.setHours(0, 0, 0, 0);
    const isUpcomingDate = bookingDate >= today;
    const isUpcomingStatus = ['pending', 'confirmed', 'deposit_pending', 'deposit_confirmed', 'awaiting_info', 'counter_offer'].includes(booking.status);
    return isUpcomingDate && isUpcomingStatus;
  });

  const pastBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.booking_date);
    bookingDate.setHours(0, 0, 0, 0);
    const isPastDate = bookingDate < today;
    const isPastStatus = ['completed', 'cancelled', 'no_show', 'rejected'].includes(booking.status);
    return isPastDate || isPastStatus;
  });

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + Spacing.base }]}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.tabTextActive,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.tabTextActive,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AccentColors.primary} />
            <Text style={styles.loadingText}>Loading bookings...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{error}</Text>
          </View>
        ) : displayedBookings.length > 0 ? (
          displayedBookings.map((booking) => {
            const venueImage = booking.venue?.photos?.[0] || null;
            const displayStatus = mapStatusToDisplay(booking.status);
            
            return (
              <View key={booking.id} style={styles.bookingCardWrapper}>
                <BookingCard
                  venueName={booking.venue?.name || 'Unknown Venue'}
                  venueImage={venueImage}
                  date={formatDate(booking.booking_date)}
                  time={booking.booking_time}
                  guests={booking.party_size}
                  status={displayStatus}
                  pointsEarned={booking.points_earned > 0 ? booking.points_earned : undefined}
                  onPress={() => navigation.navigate('BookingDetail', { booking })}
                />
                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      // Navigate to modify booking - reuse existing screens
                      navigation.navigate('SelectDate', { 
                        venue: booking.venue,
                        bookingId: booking.id,
                        mode: 'modify'
                      });
                    }}
                  >
                    <Text style={styles.actionButtonText}>Modify</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      navigation.navigate('RunningLate', { booking });
                    }}
                  >
                    <Text style={styles.actionButtonText}>Running Late</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => {
                      navigation.navigate('CancelBooking', { booking });
                    }}
                  >
                    <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Calendar size={32} color="#5684C4" strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyStateTitle}>
              {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
            </Text>
            <Text style={styles.emptyStateText}>
              {activeTab === 'upcoming' 
                ? 'Your next adventure awaits. Browse our curated venues and experiences.'
                : 'Your booking history will appear here.'}
            </Text>
            {activeTab === 'upcoming' && (
              <TouchableOpacity
                style={styles.discoverButton}
                onPress={() => {
                  navigation.navigate('MainTabs', { screen: 'Home' });
                }}
              >
                <Text style={styles.discoverButtonText}>Explore venues</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColors.primary,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.base,
  },
  title: {
    color: TextColors.primary,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '600',
  },
  tabSwitcher: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: 'rgba(86,132,196,0.15)',
  },
  tabText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#5684C4',
  },
  tabUnderline: {
    display: 'none',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingTop: Spacing.base,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 3,
  },
  loadingText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    marginTop: Spacing.base,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(86,132,196,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 20,
  },
  discoverButton: {
    backgroundColor: '#5684C4',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  discoverButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bookingCardWrapper: {
    marginBottom: Spacing.base,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cancelButton: {
    flex: 0,
    paddingHorizontal: 20,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
  },
  cancelButtonText: {
    color: 'rgba(239, 68, 68, 0.8)',
  },
});
