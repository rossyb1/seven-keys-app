import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'lucide-react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, StatusColors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/brand';

interface BookingCardProps {
  venueName: string;
  venueImage?: string | any;
  date: string;
  time: string;
  guests: number;
  status: 'CONFIRMED' | 'CONFIRMING' | 'COMPLETED' | 'CANCELLED';
  pointsEarned?: number;
  onPress?: () => void;
}

export default function BookingCard({
  venueName,
  venueImage,
  date,
  time,
  guests,
  status,
  pointsEarned,
  onPress,
}: BookingCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'CONFIRMED':
        return StatusColors.confirmed;
      case 'CONFIRMING':
        return StatusColors.confirming;
      case 'COMPLETED':
        return StatusColors.completed;
      case 'CANCELLED':
        return StatusColors.cancelled;
      default:
        return TextColors.secondary;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {venueImage ? (
          <Image 
            source={typeof venueImage === 'string' ? { uri: venueImage } : venueImage} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Camera size={24} color={TextColors.tertiary} strokeWidth={1.5} />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.venueName} numberOfLines={1}>{venueName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
        <Text style={styles.dateTime}>
          {date} • {time}
        </Text>
        <Text style={styles.guests}>{guests} guests</Text>
        {pointsEarned && (
          <Text style={styles.pointsEarned}>+{pointsEarned.toLocaleString()} points earned</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: BackgroundColors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(86, 132, 196, 0.1)',
    marginBottom: Spacing.base,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: BackgroundColors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: Spacing.base,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  venueName: {
    flex: 1,
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    marginRight: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  dateTime: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs / 2,
  },
  guests: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
  },
  pointsEarned: {
    color: AccentColors.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    marginTop: Spacing.xs,
  },
});
