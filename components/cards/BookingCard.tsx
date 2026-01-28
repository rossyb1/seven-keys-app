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
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  imageContainer: {
    width: 90,
    height: 90,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  venueName: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  dateTime: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginBottom: 2,
  },
  guests: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  pointsEarned: {
    color: '#5684C4',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
});
