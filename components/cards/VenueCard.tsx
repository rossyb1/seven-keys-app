import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera } from 'lucide-react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, BorderRadius, Typography, Shadows } from '../../constants/brand';
import type { Venue } from '../../src/types/database';
import { getVenueImage } from '../../src/utils/venueImages';

interface VenueCardProps {
  venue: Venue;
  onPress?: () => void;
  width?: number | string;
}

// Helper function to format venue type for display
const formatVenueType = (type: Venue['type']): string => {
  const typeMap: Record<Venue['type'], string> = {
    'restaurant': 'Restaurant',
    'beach_club': 'Beach Club',
    'nightclub': 'Nightclub',
    'event': 'Event',
  };
  return typeMap[type] || type;
};

export default function VenueCard({ venue, onPress, width }: VenueCardProps) {
  // Defensive checks - return null if venue is not provided
  if (!venue) {
    return null;
  }

  // Get location or city as fallback
  const location = venue.location || venue.city || 'Location TBD';
  
  // Format venue type (with fallback)
  const formattedType = venue.type ? formatVenueType(venue.type) : 'Venue';
  
  // Get venue name (with fallback)
  const venueName = venue.name || 'Unnamed Venue';
  
  // Try to get local image first, then fall back to remote URL
  const localImage = getVenueImage(venueName);
  const remoteImageUrl = venue.photos && Array.isArray(venue.photos) && venue.photos.length > 0 
    ? venue.photos[0] 
    : null;
  
  return (
    <TouchableOpacity style={[styles.card, width && { width }]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {localImage ? (
          <>
            <Image 
              source={localImage} 
              style={styles.image} 
              contentFit="cover"
              cachePolicy="memory-disk"
            />
            <LinearGradient
              colors={['transparent', 'rgba(9, 22, 46, 0.8)']}
              style={styles.imageOverlay}
            />
          </>
        ) : remoteImageUrl ? (
          <>
            <Image 
              source={{ uri: remoteImageUrl }} 
              style={styles.image} 
              contentFit="cover"
              cachePolicy="memory-disk"
            />
            <LinearGradient
              colors={['transparent', 'rgba(9, 22, 46, 0.8)']}
              style={styles.imageOverlay}
            />
          </>
        ) : (
          <LinearGradient
            colors={[BackgroundColors.secondary, BackgroundColors.cardBg]}
            style={styles.imagePlaceholder}
          >
            <Camera size={32} color={TextColors.tertiary} strokeWidth={1.5} />
          </LinearGradient>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{venueName}</Text>
        <Text style={styles.typeCity} numberOfLines={1}>
          {formattedType} • {location}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: BackgroundColors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(86, 132, 196, 0.1)',
    marginBottom: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    overflow: 'hidden',
    position: 'relative',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
  },
  name: {
    color: TextColors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  typeCity: {
    color: TextColors.secondary,
    fontSize: 12,
  },
});
