import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  MapPin,
  Clock,
  CreditCard,
  Star,
  Check,
  MessageCircle,
  Shirt,
} from 'lucide-react-native';
import type { Venue } from '../../src/types/database';
import { getVenueImage } from '../../src/utils/venueImages';

interface VenueDetailScreenProps {
  navigation: any;
  route: any;
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

// Get price indicator based on minimum spend
const getPriceIndicator = (minSpend: number | null): string => {
  if (!minSpend) return '$$';
  if (minSpend < 500) return '$';
  if (minSpend < 1000) return '$$';
  if (minSpend < 2000) return '$$$';
  return '$$$$';
};

// Format operating hours
const formatOperatingHours = (hours: Record<string, string> | null): string => {
  if (!hours) return 'Hours vary';
  
  const dayNames: Record<string, string> = {
    'monday': 'Mon',
    'tuesday': 'Tue',
    'wednesday': 'Wed',
    'thursday': 'Thu',
    'friday': 'Fri',
    'saturday': 'Sat',
    'sunday': 'Sun',
  };
  
  const entries = Object.entries(hours);
  if (entries.length === 0) return 'Hours vary';
  
  // If all days have same hours, show simplified format
  const uniqueHours = new Set(Object.values(hours));
  if (uniqueHours.size === 1) {
    return Array.from(uniqueHours)[0];
  }
  
  // Otherwise show first few days
  return entries.slice(0, 3).map(([day, time]) => 
    `${dayNames[day.toLowerCase()] || day}: ${time}`
  ).join(', ');
};

export default function VenueDetailScreen({ navigation, route }: VenueDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const venue = route.params?.venue as Venue | undefined;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!venue) {
    navigation.goBack();
    return null;
  }

  // Calculate back button top position: status bar height + padding
  const backButtonTop = insets.top + 12;
  
  // Hero section total height: visible image (220px) + status bar area
  // This allows the image to extend behind the status bar but be fully visible when scrolling
  const heroSectionHeight = 220 + insets.top;

  // Get venue images
  const localImage = getVenueImage(venue.name);
  const remoteImages = venue.photos && venue.photos.length > 0 ? venue.photos : [];
  const images = localImage ? [localImage] : remoteImages;
  const currentImage = images[currentImageIndex] || null;

  // Get venue initial for logo
  const venueInitial = venue.name[0]?.toUpperCase() || 'V';

  // Handle directions
  const handleDirections = () => {
    const address = venue.location || venue.city || 'Dubai';
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(mapsUrl).catch(err => console.error('Error opening maps:', err));
  };

  // Handle make reservation
  const handleMakeReservation = () => {
    navigation.navigate('SelectDate', { venue });
  };

  // Handle concierge
  const handleConcierge = () => {
    navigation.navigate('MessageConcierge', { venue });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Section */}
        <View style={[styles.heroSection, { height: heroSectionHeight }]}>
          {currentImage ? (
            <ImageBackground
              source={typeof currentImage === 'string' ? { uri: currentImage } : currentImage}
              style={styles.heroImage}
              resizeMode="cover"
            >
              {/* Gradient Overlay */}
              <LinearGradient
                colors={['transparent', '#0A1628']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.heroGradient}
              />
              
              {/* Back Button */}
              <TouchableOpacity
                style={[styles.backButton, { top: backButtonTop }]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <View style={styles.backButtonCircle}>
                  <ChevronLeft size={20} color="#FFFFFF" strokeWidth={2} />
                </View>
              </TouchableOpacity>

              {/* Venue Info at Bottom Left */}
              <View style={styles.venueInfoContainer}>
                <View style={styles.venueInfoRow}>
                  <View style={styles.logoBox}>
                    <Text style={styles.logoText}>{venueInitial}</Text>
                  </View>
                  <View style={styles.venueInfoText}>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <View style={styles.venueMeta}>
                      <Text style={styles.venueType}>{formatVenueType(venue.type)}</Text>
                      <Text style={styles.venueSeparator}> • </Text>
                      <Text style={styles.priceIndicator}>
                        {getPriceIndicator(venue.minimum_spend)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ImageBackground>
          ) : (
            <View style={[styles.heroImagePlaceholder, { height: heroSectionHeight }]}>
              <LinearGradient
                colors={['#1A2A3A', '#0A1628']}
                style={[styles.heroGradient, { height: heroSectionHeight }]}
              >
                <TouchableOpacity
                  style={[styles.backButton, { top: backButtonTop }]}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <View style={styles.backButtonCircle}>
                    <ChevronLeft size={20} color="#FFFFFF" strokeWidth={2} />
                  </View>
                </TouchableOpacity>
                <View style={styles.venueInfoContainer}>
                  <View style={styles.venueInfoRow}>
                    <View style={styles.logoBox}>
                      <Text style={styles.logoText}>{venueInitial}</Text>
                    </View>
                    <View style={styles.venueInfoText}>
                      <Text style={styles.venueName}>{venue.name}</Text>
                      <View style={styles.venueMeta}>
                        <Text style={styles.venueType}>{formatVenueType(venue.type)}</Text>
                        <Text style={styles.venueSeparator}> • </Text>
                        <Text style={styles.priceIndicator}>
                          {getPriceIndicator(venue.minimum_spend)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Quick Info Card */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.infoRow}
              onPress={handleDirections}
              activeOpacity={0.7}
            >
              <View style={styles.infoRowLeft}>
                <MapPin size={16} color="#5684C4" strokeWidth={1.5} />
                <Text style={styles.infoText}>{venue.location || venue.city || 'Dubai'}</Text>
              </View>
              <Text style={styles.directionsLink}>Directions →</Text>
            </TouchableOpacity>
            <View style={styles.infoRowDivider} />
            <View style={styles.infoRow}>
              <View style={[styles.infoRowLeft, { flex: 1 }]}>
                <Clock size={16} color="#5684C4" strokeWidth={1.5} />
                <Text style={styles.infoText} numberOfLines={1}>
                  {formatOperatingHours(venue.operating_hours)}
                </Text>
              </View>
              <View style={[styles.infoRowLeft, { flex: 1, marginLeft: 20 }]}>
                <CreditCard size={16} color="#5684C4" strokeWidth={1.5} />
                <Text style={styles.infoText} numberOfLines={1}>
                  Min. {venue.minimum_spend ? `AED ${venue.minimum_spend.toLocaleString()}` : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* Best For Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>BEST FOR</Text>
            <View style={styles.pillsContainer}>
              {(venue.vibe_tags && venue.vibe_tags.length > 0
                ? venue.vibe_tags
                : ['Date Night', 'Celebrations', 'Business']
              ).map((tag, index) => (
                <View key={index} style={styles.pill}>
                  <Text style={styles.pillText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Member Benefits Card */}
          <View style={styles.benefitsCard}>
            <View style={styles.benefitsHeader}>
              <Star size={12} color="#5684C4" fill="#5684C4" />
              <Text style={styles.benefitsLabel}>MEMBER BENEFITS</Text>
            </View>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Check size={16} color="#5684C4" strokeWidth={2} />
                <Text style={styles.benefitText}>Priority reservations</Text>
              </View>
              <View style={styles.benefitItem}>
                <Check size={16} color="#5684C4" strokeWidth={2} />
                <Text style={styles.benefitText}>Best table allocation</Text>
              </View>
            </View>
          </View>

          {/* About Card */}
          {venue.description && (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>ABOUT</Text>
              <Text style={styles.descriptionText}>{venue.description}</Text>
            </View>
          )}

          {/* Dress Code Card */}
          <View style={styles.card}>
            <View style={styles.dressCodeHeader}>
              <View style={styles.dressCodeHeaderLeft}>
                <Shirt size={16} color="#5684C4" strokeWidth={1.5} />
                <Text style={styles.cardLabel}>DRESS CODE</Text>
              </View>
              <View style={styles.dressCodeBadge}>
                <Text style={styles.dressCodeBadgeText}>Smart Casual</Text>
              </View>
            </View>
            <Text style={styles.dressCodeNote}>
              No sportswear, shorts, or flip-flops.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA Bar */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.conciergeButton}
          onPress={handleConcierge}
          activeOpacity={0.7}
        >
          <MessageCircle size={20} color="#5684C4" strokeWidth={1.5} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reservationButton}
          onPress={handleMakeReservation}
          activeOpacity={0.8}
        >
          <Text style={styles.reservationButtonText}>Make a Reservation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroSection: {
    position: 'relative',
    marginTop: 0,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroImagePlaceholder: {
    width: '100%',
    backgroundColor: '#1A2A3A',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  venueInfoContainer: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
  },
  venueInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#1A2A3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  venueInfoText: {
    flex: 1,
  },
  venueName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  venueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueType: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  venueSeparator: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  priceIndicator: {
    color: '#5684C4',
    fontSize: 13,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#111D2E',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  directionsLink: {
    color: '#5684C4',
    fontSize: 13,
    fontWeight: '500',
  },
  infoRowDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 12,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  pillText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  benefitsCard: {
    backgroundColor: 'rgba(86,132,196,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(86,132,196,0.2)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  benefitsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5684C4',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  benefitsList: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  descriptionText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    lineHeight: 19.5,
  },
  dressCodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dressCodeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dressCodeBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  dressCodeBadgeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  dressCodeNote: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10,22,40,0.95)',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  conciergeButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reservationButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#5684C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reservationButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
