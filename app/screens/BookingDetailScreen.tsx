import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandColors, BackgroundColors, TextColors, AccentColors, StatusColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { ChevronLeft, Calendar, Clock, Users, Armchair, FileText, CreditCard, MessageCircle, Camera, X } from '../../components/icons/AppIcons';
import type { Booking } from '../../src/types/database';
import type { Venue } from '../../src/types/database';

interface BookingDetailScreenProps {
  navigation: any;
  route: any;
}

type BookingWithVenue = Booking & { venue: Pick<Venue, 'id' | 'name' | 'type' | 'location' | 'photos'> };

export default function BookingDetailScreen({ navigation, route }: BookingDetailScreenProps) {
  const booking = route.params?.booking as BookingWithVenue | undefined;

  if (!booking) {
    // If no booking passed, go back
    React.useEffect(() => {
      navigation.goBack();
    }, []);
    return null;
  }

  const venue = booking.venue;
  const venueImage = venue?.photos?.[0] || null;

  // Helper function to format date nicely
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day} ${month} ${year}`;
  };

  // Helper function to format time
  const formatTime = (timeString: string): string => {
    // If time is already formatted (e.g., "8:00 PM"), return as is
    if (timeString.includes('PM') || timeString.includes('AM')) {
      return timeString;
    }
    
    // Otherwise, parse and format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes || '00'} ${ampm}`;
  };

  // Helper function to format venue type
  const formatVenueType = (type: string): string => {
    const typeMap: Record<string, string> = {
      'restaurant': 'Restaurant',
      'beach_club': 'Beach Club',
      'nightclub': 'Nightclub',
      'event': 'Event',
    };
    return typeMap[type] || type;
  };

  // Helper function to map database status to display status
  const mapStatusToDisplay = (status: Booking['status']): { text: string; color: string } => {
    switch (status) {
      case 'confirmed':
      case 'deposit_confirmed':
        return { text: 'CONFIRMED', color: StatusColors.confirmed };
      case 'pending':
      case 'awaiting_info':
      case 'deposit_pending':
        return { text: 'CONFIRMING', color: StatusColors.confirming };
      case 'completed':
        return { text: 'COMPLETED', color: StatusColors.completed };
      case 'cancelled':
      case 'rejected':
        return { text: 'CANCELLED', color: StatusColors.cancelled };
      default:
        return { text: 'CONFIRMING', color: StatusColors.confirming };
    }
  };

  // Parse table preference if it's a JSON string
  const parseTablePreference = (preference: string | null): string | null => {
    if (!preference) return null;
    try {
      const parsed = JSON.parse(preference);
      if (typeof parsed === 'object') {
        const parts: string[] = [];
        if (parsed.smoking) parts.push(parsed.smoking);
        if (parsed.location) parts.push(parsed.location);
        if (parsed.seating) parts.push(parsed.seating);
        return parts.length > 0 ? parts.join(' • ') : null;
      }
      return preference;
    } catch {
      return preference;
    }
  };

  const statusDisplay = mapStatusToDisplay(booking.status);
  const tablePreference = parseTablePreference(booking.table_preference);

  // Determine which actions to show based on status
  const getAvailableActions = () => {
    const isActive = ['pending', 'confirmed', 'deposit_pending', 'deposit_confirmed', 'awaiting_info', 'counter_offer'].includes(booking.status);
    const isCompleted = booking.status === 'completed';
    const isCancelled = ['cancelled', 'rejected'].includes(booking.status);

    if (isActive) {
      return [
        { label: 'Cancel Booking', action: 'cancel' },
        { label: 'Running Late', action: 'runningLate' },
        { label: 'Change Date', action: 'changeDate' },
        { label: 'Change Time', action: 'changeTime' },
        { label: 'Message Concierge', action: 'message' },
      ];
    } else if (isCompleted || isCancelled) {
      return [
        { label: 'Book Again', action: 'bookAgain' },
      ];
    }
    return [];
  };

  const handleActionPress = (action: string) => {
    switch (action) {
      case 'cancel':
        navigation.navigate('CancelBooking', { booking });
        break;
      case 'runningLate':
        navigation.navigate('RunningLate', { booking });
        break;
      case 'changeDate':
        navigation.navigate('ChangeDate', { booking });
        break;
      case 'changeTime':
        navigation.navigate('ChangeTime', { booking });
        break;
      case 'message':
        navigation.navigate('MessageConcierge', { booking });
        break;
      case 'bookAgain':
        // Navigate to VenueDetailScreen with the venue
        if (venue && venue.id) {
          // Navigate to VenueDetail - it will fetch the full venue by ID
          navigation.navigate('VenueDetail', { venue: { id: venue.id } });
        }
        break;
      default:
        break;
    }
  };

  const availableActions = getAvailableActions();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          {venueImage ? (
            <Image 
              source={typeof venueImage === 'string' ? { uri: venueImage } : venueImage} 
              style={styles.heroImage} 
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={[BackgroundColors.secondary, BackgroundColors.cardBg]}
              style={styles.heroImage}
            >
              <Camera size={48} color={TextColors.tertiary} strokeWidth={1} />
            </LinearGradient>
          )}
        </View>

        {/* Venue Info */}
        <View style={styles.venueInfo}>
          <Text style={styles.venueName}>{venue?.name || 'Unknown Venue'}</Text>
          <Text style={styles.venueType}>
            {venue?.type ? formatVenueType(venue.type) : ''}
            {venue?.location ? ` • ${venue.location}` : ''}
          </Text>
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <Text style={[styles.statusDot, { color: statusDisplay.color }]}>●</Text>
          <Text style={[styles.statusText, { color: statusDisplay.color }]}>{statusDisplay.text}</Text>
        </View>

        <View style={styles.divider} />

        {/* Booking Details */}
        <View style={styles.detailsList}>
          <View style={styles.detailRow}>
            <Calendar size={20} color={TextColors.secondary} strokeWidth={1.5} />
            <Text style={styles.detailText}>{formatDate(booking.booking_date)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Clock size={20} color={TextColors.secondary} strokeWidth={1.5} />
            <Text style={styles.detailText}>{formatTime(booking.booking_time)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Users size={20} color={TextColors.secondary} strokeWidth={1.5} />
            <Text style={styles.detailText}>{booking.party_size} guests</Text>
          </View>
          {tablePreference && (
            <View style={styles.detailRow}>
              <Armchair size={20} color={TextColors.secondary} strokeWidth={1.5} />
              <Text style={styles.detailText}>{tablePreference}</Text>
            </View>
          )}
          {booking.special_requests && (
            <View style={styles.detailRow}>
              <FileText size={20} color={TextColors.secondary} strokeWidth={1.5} />
              <Text style={styles.detailText}>{booking.special_requests}</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Deposit */}
        {booking.deposit_required && (
          <>
            <View style={styles.depositRow}>
              <CreditCard size={20} color={TextColors.secondary} strokeWidth={1.5} />
              <Text style={styles.depositText}>
                Deposit: {booking.deposit_confirmed ? 'Confirmed' : 'Pending'}
                {booking.minimum_spend && ` • Minimum spend: AED ${booking.minimum_spend.toLocaleString()}`}
              </Text>
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* Add to Calendar */}
        <TouchableOpacity style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>Add to Calendar</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Action Buttons */}
        {availableActions.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>MANAGE BOOKING</Text>
            <View style={styles.actionsList}>
              {availableActions.map((action, index) => {
                let IconComponent;
                let iconColor = TextColors.primary;
                
                if (action.action === 'cancel') {
                  IconComponent = X;
                  iconColor = StatusColors.cancelled;
                } else if (action.action === 'runningLate' || action.action === 'changeTime') {
                  IconComponent = Clock;
                } else if (action.action === 'changeDate') {
                  IconComponent = Calendar;
                } else if (action.action === 'message') {
                  IconComponent = MessageCircle;
                } else if (action.action === 'bookAgain') {
                  IconComponent = Calendar;
                }
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.actionButton}
                    onPress={() => handleActionPress(action.action)}
                  >
                    {IconComponent && <IconComponent size={20} color={iconColor} strokeWidth={1.5} style={{ marginRight: Spacing.base }} />}
                    <Text style={[styles.actionLabel, action.action === 'cancel' && { color: StatusColors.cancelled }]}>
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.divider} />
          </>
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
  content: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: Spacing.xl,
    left: Spacing.xl,
    zIndex: 10,
  },
  heroImageContainer: {
    width: '100%',
    height: 200,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  venueInfo: {
    padding: Spacing.xl,
    paddingBottom: Spacing.base,
  },
  venueName: {
    color: TextColors.primary,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
  },
  venueType: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.base,
  },
  statusDot: {
    color: StatusColors.confirmed,
    fontSize: Typography.fontSize.lg,
    marginRight: Spacing.sm,
  },
  statusText: {
    color: StatusColors.confirmed,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: AccentColors.border,
    marginVertical: Spacing.xl,
    marginHorizontal: Spacing.xl,
  },
  detailsList: {
    paddingHorizontal: Spacing.xl,
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
  depositRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  depositText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    marginLeft: Spacing.base,
  },
  outlineButton: {
    marginHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
  sectionHeader: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    letterSpacing: 2,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.base,
  },
  actionsList: {
    paddingHorizontal: Spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    minHeight: 52,
    marginBottom: Spacing.sm,
  },
  outlineButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLabel: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
});
